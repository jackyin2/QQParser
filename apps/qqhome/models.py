# coding=utf-8
from __future__ import unicode_literals
from django.db import models
from datetime import datetime
# Create your models here.


class QQContent(models.Model):
    """ QQ 记录表"""
    num = models.IntegerField(verbose_name=u'行号')
    qqname = models.CharField(verbose_name=u'QQ名称', max_length=50)
    content = models.CharField(verbose_name=u'聊天内容', max_length=1000)
    qqdate = models.DateTimeField(verbose_name=u'聊天时间')
    # add_time = models.DateField(default='', verbose_name=u'记录时间')

    class Meta:
        verbose_name = u'QQ聊天记录'
        verbose_name_plural = verbose_name

class FileUp(models.Model):
    """文件上传表"""
    filename = models.FileField(verbose_name=u'文件名称', upload_to='fileupload/')
    isparser = models.CharField(choices=(('y', 'Yes'), ('n', 'No')), max_length=3, verbose_name=u'是否分析')
    uptime = models.DateTimeField(default=datetime.now, verbose_name='上传时间')

    class Meta:
        verbose_name = u'文件上传'
        verbose_name_plural = verbose_name

# 