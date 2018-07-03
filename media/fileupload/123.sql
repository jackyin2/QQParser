create database  if not exists testdb default character set utf8

#test_data存放测试用例(接口)相关数据
create table test_data
(
	case_id int not null unique, # 用例ID,唯一
	http_method varchar(5) not null,  #http方法（POST、GET
	request_name VARCHAR(30), # 自定义接口名称 建议格式：接口名-测试简单说明
	request_url VARCHAR(200) NOT NULL, # 接口URL
	request_param VARCHAR(1000) NOT NULL, # 接口所需的全部或部分参数--python字典形式的字符串
	test_method VARCHAR(50) NOT NULL, # 测试方法，一个测试用例对应一个方法
	test_desc VARCHAR(2000) NOT NULL # 测试描述--主要描述这个用例的测试点、测试目的
	
);

#pre_condition_data存放完成testdb接口运行前置条件所需的数据
CREATE TABLE pre_condition_data
(
	case_id INT NOT NULL, # 用例ID
	step INT NOT NULL, # 执行该用例ID需要的第一步、第一个前提条件的step ID
	request_url VARCHAR(200) NOT NULL, # 接口URL
	request_param VARCHAR(1000) NOT NULL, # 接口参数--python字典形式的字符串
	other VARCHAR(1000), # 保留字段，可能是执行用例需要预先执行的sql语句等
	test_desc VARCHAR(2000) NOT NULL, # 数据描述--描述这条数据用途
	PRIMARY KEY(case_id, step)
);

#test_result存放测试结果
CREATE TABLE test_result
(
case_id INT NOT NULL UNIQUE, # 用例ID
http_method VARCHAR(5) NOT NULL, # http方法（POST、GET
request_name VARCHAR(30), # 自定义接口名称
request_url VARCHAR(200) NOT NULL, # 接口URL
request_param VARCHAR(1000) NOT NULL, # 接口所需的全部参数--python字典形式的字符串
test_method VARCHAR(50) NOT NULL, # 接口测试方法
test_desc VARCHAR(2000) NOT NULL, # 数据描述--描述测试目的
result VARCHAR(20) NOT NULL, # 测试结果
reason VARCHAR(20) # 测试失败原因
);

insert into test_data(case_id,
http_method,
request_name,
request_url,
request_param,
test_method,
test_desc
)
values
(1,
'post',
'login-normal',
'/appServer/interface/user/login?', 
'{"code":1,"user":{"Id":"1","OrgId":null,"UserName":"admin","DisplayName":"admin","Password":"e10adc3949ba59abbe56e057f20f883e","IsValid":true,"CitizenID":"","Mobile":"","Email":null,"DateCreate":"\/Date(-62135596800000)\/","DateLastVisit":"\/Date(1522234829083)\/","DefaultUrl":null,"AvatorUrl":"http://106.15.46.30:9999/cms/a@A883524796780F3E3CBCADEF33463EE2.jpeg?time=636495519032931192&token=26CFF5347C555BD1062A8E6C6ECACFF2","DataSource":null,"UserType":1,"PinYinAtFirst":null,"FullPinYin":null,"Prop1":"","Prop2":"bxrwaicmpbdg0gg7-timra","Prop3":"","Prop4":"","Prop5":"","Prop6":"","Prop7":"","Prop8":"","Prop9":"","Prop10":"","Prop11":"14","Prop12":"0.000","Prop13":"3219","Prop14":"","Prop15":"","PropertyName":null,"PropertyValue":null,"ExtAttrs":{"ExtendedAttributesCount":0,"Keys":[]},"TableName":"gUser"},"token":"whm1algoakpimyx-1ajmfa"}',
'test_login_normal',
'测试登录，正向')


insert into test_data(case_id,
http_method,
request_name,
request_url,
request_param,
test_method,
test_desc
)
values
(2,
'post',
'login-normal',
'/appServer/interface/user/login?', 
'{"code":1,"user":{"Id":"1","OrgId":null,"UserName":"admin","DisplayName":"admin","Password":"e10adc3949ba59abbe56e057f20f883e","IsValid":true,"CitizenID":"","Mobile":"","Email":null,"DateCreate":"\/Date(-62135596800000)\/","DateLastVisit":"\/Date(1522234829083)\/","DefaultUrl":null,"AvatorUrl":"http://106.15.46.30:9999/cms/a@A883524796780F3E3CBCADEF33463EE2.jpeg?time=636495519032931192&token=26CFF5347C555BD1062A8E6C6ECACFF2","DataSource":null,"UserType":1,"PinYinAtFirst":null,"FullPinYin":null,"Prop1":"","Prop2":"bxrwaicmpbdg0gg7-timra","Prop3":"","Prop4":"","Prop5":"","Prop6":"","Prop7":"","Prop8":"","Prop9":"","Prop10":"","Prop11":"14","Prop12":"0.000","Prop13":"3219","Prop14":"","Prop15":"","PropertyName":null,"PropertyValue":null,"ExtAttrs":{"ExtendedAttributesCount":0,"Keys":[]},"TableName":"gUser"},"token":"whm1algoakpimyx-1ajmfa"}',
'test_login_normal',
'测试登录，正向')

insert into test_data(case_id, http_method)VALUES (3, 'post')