# _*_ coding: utf-8 _*_
__author__ = 'jack'
__date__ = '2017/9/16 10:41'

import xadmin
from xadmin.views import BaseAdminView, CommAdminView
from .models import FileUp

class BaseSetting(object):
    enable_themes = True
    use_bootswatch = True   # 上面两条是来控制后台可以进行主题切换的功能


class GlobalSettings(object):
    site_title = "管理系统"     # 修改logo处的内容
    site_footer = 'QQ记录后台'         # 修改底部的footer内容
    menu_style = 'accordion'          # 左侧导航栏样式调整

class FileUpAdmin(object):
    list_display = ['filename', 'uptime']      # 控制列表字段展示
    # search_fields = ['filename']                 # 控制查询条件内容
    # list_filter = ['']


# xadmin.site.register(EmailVerifyRecord, EmailVerifyRecordAdmin)
xadmin.site.register(FileUp, FileUpAdmin)
xadmin.site.register(CommAdminView, GlobalSettings)
xadmin.site.register(BaseAdminView, BaseSetting)