# coding=utf-8

# from openpyxl.writer.excel import ExcelWriter
import json

from django.http import HttpResponse, JsonResponse,HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import View
from qqhome.models import QQContent, FileUp
from pure_pagination import Paginator, EmptyPage, PageNotAnInteger
from  django.db.models import Q
# Create your views here.
import pymysql
import qq_parser
import re, os
import datetime
import time
# from .forms import FileForm


def executesql(sql1):
    db = pymysql.connect(host='localhost', user='root',
                         password='root', db='test', port=3306, charset='utf8mb4')
    cur = db.cursor()
    sql_select = sql1
    qret = cur.execute(sql_select)
    rows = cur.fetchall()
    db.commit()
    cur.close()
    db.close()
    return rows

def average(seq):
 return float(sum(seq)) / len(seq)

def avg(seq):
    list = []
    for i in seq:
        a = i[1]
        list.append(a)
    return  average(list)

def filelen(filepath):
    count=0
    thefile=open(filepath)
    while True:
        buffer=thefile.read(1024*8192)
        if not buffer:
            break
        count+=buffer.count('\n')
    thefile.close()
    return count

class QQShowView(View):
    def get(self, request):

        all_contents = QQContent.objects.all().order_by('id')
        contentslen = all_contents.count()

        # 关键字搜索
        search_keywords = request.GET.get('keywords', '')
        startD = str(request.GET.get('startD', ''))
        endD = str(request.GET.get('endD', ''))
        # startD = datetime.strptime(startD,'%Y-%m-%d')
        # endD =datetime.datetime.strptime(endD,'%Y-%m-%d')

        # 筛选
        if search_keywords and startD and endD:
            startD = startD + " 00:00:00"
            endD = endD + " 00:00:00"
            all_contents = all_contents.filter(Q(content__icontains=search_keywords), Q(qqdate__range=(startD, endD)))
        elif search_keywords and startD:
            startD = startD + " 00:00:00"
            all_contents = all_contents.filter(Q(content__icontains=search_keywords), Q(qqdate__gte=startD))
        elif search_keywords and endD:
            endD = endD + " 00:00:00"
            all_contents = all_contents.filter(Q(content__icontains=search_keywords), Q(qqdate__lte=endD))
        elif startD and endD:
            startD = startD + " 00:00:00"
            endD = endD + " 00:00:00"
            all_contents = all_contents.filter(Q(qqdate__range=(startD, endD)))
        elif search_keywords:
            all_contents = all_contents.filter(Q(content__icontains=search_keywords))
        elif startD:
            startD = startD + " 00:00:00"
            all_contents = all_contents.filter(Q(qqdate__gte=startD))
            contentslen = all_contents.count()
        elif endD:
            endD = endD + " 00:00:00"
            all_contents = all_contents.filter(qqdate__lte=endD)
        else:
            all_contents = QQContent.objects.all().order_by('id')

        contentslen = all_contents.count()
        try:
            page = request.GET.get('page', 1)
        except PageNotAnInteger:
            page = 1
        p = Paginator(all_contents, per_page=10, request=request)
        contents = p.page(page)

        return  render(request, 'Home_qq_lists.html', {
            'all_contents': contents,
            'contentslen': contentslen,
        })


class QQParserView(View):
    def get(self, request):
        all_contents = QQContent.objects.all().order_by('id')
        content_nums = all_contents.count()
        # content_nums_by_year2018 = QQContent.objects.filter(qqdate__contains='2018').count()
        currenttime = time.time()

        datas_hour = executesql('''select hour(qqdate) as hour, count(qqdate) as times from qqhome_qqcontent group by hour(qqdate)''')
        datas_year = executesql('''select year(qqdate) as year, count(qqdate) as times from qqhome_qqcontent group by year(qqdate)''')
        datas_month = executesql('''select month(qqdate) as month, count(qqdate) as times from qqhome_qqcontent group by month(qqdate)''')
        datas_day = executesql( '''select day(qqdate) as month, count(qqdate) as times from qqhome_qqcontent group by day(qqdate)''')
        # datas_avg_hour = executesql('''select count(qqdate) as times from qqhome_qqcontent group by hour(qqdate)''')
        avg_day = avg(datas_day)
        avg_year = avg(datas_year)
        avg_hour = avg(datas_hour)
        avg_month = avg(datas_month)
        # print(type(qret), qret)

        return  render(request, 'Home_qq_parser.html', {
            'all_contents': all_contents,
            'content_nums': content_nums,
            'rows_hour': datas_hour,
            'rows_year': datas_year,
            'rows_month': datas_month,
            'rows_day': datas_day,
            'avg_hour': avg_hour,
            'avg_day': avg_day,
            'avg_year': avg_year,
            'avg_month': avg_month,
        })


class MonthView(View):
    def get(self, request):

        return render(request, "Home_qq_parser_moth.html", {})

    def post(self, request):
        # import calendar
        # rl = calendar.month(int(year),int(month))
        # cur_date_first = datetime.datetime(datetime.date.today().year, datetime.date.today().month, 1)
        # cur_date_last = datetime.datetime(datetime.date.today().year, datetime.date.today().month + 1, 1)
        # data = []
        # dict = {}
        # if year and month:
        #     year = int(year)
        #     month = int(month)
        #     date_first = datetime.datetime(year, month, 1)
        #     date_last = datetime.datetime(year, month + 1, 1) - datetime.timedelta(1)
        a_count = []
        stra = request.POST.get('listb', '')
        year = request.POST.get('year', 0)
        straTlisa = eval(stra)
        for value in straTlisa:
            listb = value.split('-')
            month = listb[0]
            day = listb[1]
            count= QQContent.objects.filter(Q(qqdate__year = year), Q(qqdate__month=month), Q(qqdate__day=day)).count()
            a_count.append(count)
        month_day_range =range(len(a_count))
        if sum(a_count):
            # 求平均值
            avg_count = average(a_count)
            month_day_range = str(month_day_range)
            print(avg_count)
            return HttpResponse(
                '{"status": "success","msg": "有数据","a_count": '+str(a_count)+',"avg_count":'+str(avg_count)+'}',
                content_type='application/json')
        else:
            return HttpResponse(
                '{ "status" : "fail","msg":  "没有数据"}',
                content_type='application/json')
        # print(a_count)
        # return render(request, 'Home_qq_parser_moth.html', {
        #     'a_count': a_count,
        #     'month_day_range':month_day_range
        # })


class UpFilesView(View):
    def get(self, request):
        all_files = FileUp.objects.all().order_by('-uptime')
        # 关键字搜索
        search_keywords = request.GET.get('keywords', '')
        if search_keywords:
            all_files = all_files.filter(Q(filename__icontains=search_keywords))
        else:
            all_files = FileUp.objects.all().order_by('-uptime')
        #  统计数量
        filecounts = all_files.count()
        try:
            page = request.GET.get('page', 1)
        except PageNotAnInteger:
            page = 1
        p = Paginator(all_files, per_page=10, request=request)
        all_files = p.page(page)

        return render(request, 'Home_files.html', {
            'all_files': all_files,
            'filecounts': filecounts,
        })

    def post(self, request):
        # file_obj = request.FILES.get('file')
        file = request.FILES['file_url']
        filename = str(request.FILES['file_url'])
        if file and filename:
            path = 'media/fileupload/'  # 上传文件的保存路径，可以自己指定任意的路径
            if file and filename:
                # 传文件
                # print(os.path.join(path, filename))
                if not os.path.exists(path):
                    os.makedirs(path)
                with open(os.path.join(path, filename), 'wb+') as destination:   # 路径需要设计到os.path.join
                    for chunk in file.chunks():
                        destination.write(chunk)
                    destination.close()
            # 存数据库
            files = FileUp()
            files.filename = filename
            files.isparser = 'n'
            files.uptime = datetime.datetime.now()
            files.save()
            # return HttpResponse('success')
            return HttpResponseRedirect('/qqhome/upfiles/')
        else:
            return HttpResponse('fail')


class ParserCommentView(View):
    def post(self,request):
        HMS_pattern = re.compile('(.*?\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2})', re.S)
        file_id = request.POST.get('file_id', 0)
        file = FileUp.objects.get(id=file_id)
        filepath = './media/fileupload/'+str(file.filename)
        filetype = str(file.filename).split('.')[1]
        f = qq_parser.openfile(filepath)
        filelength = filelen(filepath)

        if filetype == 'txt' and filelength:
        # ####################### 分析文件主体
            values = qq_parser.qq_parser(f, HMS_pattern)
            T = qq_parser.write_to_mysql(values)
            ########################## file = FileUp()
            if T is True:
                file.isparser = 'y'
                file.save()
                return HttpResponse('{ "status" : "success","msg": "分析成功" }', content_type='application/json')
            else:
                return HttpResponse('{ "status" : "fail","msg": "分析失败" }', content_type='application/json')
        elif filelength<=0:
            return HttpResponse('{ "status" : "fail","msg": "该文件为空" }', content_type='application/json')
        elif filetype != 'txt':
            return HttpResponse('{ "status" : "fail","msg": "请检查文件格式" }', content_type='application/json')


class HighChart_M_View(View):
    def get(self, request):
        years= [2017, 2018]
        month = [1,2,3,4,5,6,7,8,9,10,11,12]
        chartlist = []
        for y in years:
            data = []                       # 如果希望每次都是一个新的列表或者数组，那么就需要在循环内进行声明变量
            chartdict2 = {}
            for m in month:
                y_m_count = QQContent.objects.filter(Q(qqdate__year=y), Q(qqdate__month=m)).count()
                data.append(y_m_count)
            chartdict2['data'] = data
            chartdict2['name'] = str(y)
            # chartlist.append(json.dumps(chartdict))
            chartlist.append(chartdict2)
            # print(json.dumps(chartdict))
        series = str(chartlist)
        series1 = chartlist
        print(type(series), series)
        print(type(series1), series1)
        return render(request, 'Home_qq_parser_highchart_M.html', {
            'series':series1
        })

class HighChart_Y_View(View):
    def get(self, request):
        years = ['2017', '2018']
        month = [1,2,3,4,5,6,7,8,9,10,11,12]
        chartlist = []
        for y in years:
            data = []                       # 如果希望每次都是一个新的列表或者数组，那么就需要在循环内进行声明变量
            chartdict2 = {}
            y_count = QQContent.objects.filter(Q(qqdate__year=int(y))).count()
            data.append(y_count)
            chartdict2['data'] = data
            chartdict2['name'] = y
            # chartlist.append(json.dumps(chartdict))
            chartlist.append(chartdict2)
            # print(json.dumps(chartdict))
        series = str(chartlist)


        print(type(series), series)
        return render(request, 'Home_qq_parser_highchart_Y.html', {
            'series':series,
            'years': years

        })

class HighChart_D_View(View):
    def get(self, request):
        years= [2017, 2018]
        chartlist = []
        for y in years:
            data = []                       # 如果希望每次都是一个新的列表或者数组，那么就需要在循环内进行声明变量
            chartdict2 = {}
            for m in range(1, 32):
                y_d_count = QQContent.objects.filter(Q(qqdate__year=y), Q(qqdate__day=m)).count()
                data.append(y_d_count)
            chartdict2['data'] = data
            chartdict2['name'] = str(y)
            # chartlist.append(json.dumps(chartdict))
            chartlist.append(chartdict2)
            # print(json.dumps(chartdict))
        series = str(chartlist)
        series1 = chartlist
        print(type(series), series)
        print(type(series1), series1)
        return render(request, 'Home_qq_parser_highchart_D.html', {
            'series':series1
        })

class HighChart_H_View(View):
    def get(self, request):
        years = [2017, 2018]
        chartlist = []
        for y in years:
            data = []  # 如果希望每次都是一个新的列表或者数组，那么就需要在循环内进行声明变量
            chartdict2 = {}
            for m in range(0, 24):
                y_d_count = QQContent.objects.filter(Q(qqdate__year=y), Q(qqdate__hour=m)).count()
                data.append(y_d_count)
            chartdict2['data'] = data
            chartdict2['name'] = str(y)
            # chartlist.append(json.dumps(chartdict))
            chartlist.append(chartdict2)
            # print(json.dumps(chartdict))
        series = str(chartlist)
        series1 = chartlist
        print(type(series), series)
        print(type(series1), series1)
        return render(request, 'Home_qq_parser_highchart_H.html', {
            'series': series1
        })