resume.Apps={ 	
	"list": {
				"app_html_viewer":{
					"name": "HTML Viewer",
					"description": "Open the HTML files",
					"window": 	{
									"full": "<div id='HTMLViewerWindow'><div class='WindowHead_Light4'><span style='text-align:left;'><b>HTML Viewer - <span id='WindowTargetFileName'></span></b></span><div style='right:26px;' class='WindowMiniButton_Light1' onclick='***'>&#95;</div><div class='WindowMiniButton_Light1' onclick='$$$'>&#10006;</div></div><div id='HTMLViewerContent'></div></div>",		
									"headerbar": ".WindowHead_Light4",
									"header": "#WindowTargetFileName",
									"body": "#HTMLViewerContent",
									"size": { "fixed": true},
									"build": function (obj, AppId, data, id){
										//build window for html viewer, change windows title, load content, make it front window and fadein
										var AppWindowData = resume.Apps.list[AppId].window;
										var newWindowObj = AppWindowData.full.replace("***", "resume.Apps.minimize(\""+AppId+"\",\""+id+"\");").replace("$$$", "resume.Apps.close(\""+AppId+"\",\""+id+"\");");
										$("#"+resume.Desktop).append("<div id='"+id+"'>"+newWindowObj+"</div>");
										var newWindow=$("#"+id);
										newWindow.on("click", function(e){resume.Apps.focusToWindow(id);});
										newWindow.find(AppWindowData.header).html(obj.name);
										newWindow.find(AppWindowData.body).load(obj.url);
										newWindow.fadeIn();
									}
								},
					
					"start": function(obj, newWindow, path, strPath){
						var appId=resume.FExtension[obj.type];
						var objData={vfspath:path};			//it is for later use
						resume.Apps.appToTask(obj, appId, newWindow, objData, strPath);
					},
					"taskbar": {
						"icon":"doc",
						"maxproc":10						
					}
				},
				"app_file_explorer":{
					"name": "Explorer",
					"description": "Explorer the virtual file system",
					"window": 	{
									"full": "<div id='MyWindow'><div class='WindowHead_Light4'><span style='text-align:left;'><b>Explorer - <span id='WindowTargetFileName'></span></b></span><div style='right:26px;' class='WindowMiniButton_Light1' onclick='***'>&#95;</div><div class='WindowMiniButton_Light1' onclick='$$$'>&#10006;</div></div><div id='MyWindowAddressBarDiv'><input type='text' id='FileExplorerAddressBar' onfocus='this.blur()' readonly value='./thefolderpath'></div><div id='MyWindowContent' style='top:61px;'></div></div>",		
									"headerbar": ".WindowHead_Light4",
									"header": "#WindowTargetFileName",
									"body": "#MyWindowContent",
									"fulladdress": "#MyWindowAddressBarDiv",
									"upbutton": "#FileExplorerGoUp",
									"path": "#FileExplorerAddressBar",
									"size": { "fixed": false, "width": 700, "height": 500},
									"build": function (obj, AppId, data, id){
										var AppWindowData = resume.Apps.list[AppId].window;
										var NewPosition=resume.Apps.randomWindowPos(AppWindowData.size.width, AppWindowData.size.height);
										var newWindowObj = AppWindowData.full.replace("***", "resume.Apps.minimize(\""+AppId+"\",\""+id+"\");").replace("$$$", "resume.Apps.close(\""+AppId+"\",\""+id+"\");");
										$("#"+resume.Desktop).append("<div id='"+id+"' style='width:"+AppWindowData.size.width+"px;height:"+AppWindowData.size.height+"px;"+NewPosition+"'>"+newWindowObj+"</div>");
										var newWindow=$("#"+id);
										newWindow.on("click", function(e){resume.Apps.focusToWindow(id);});
										newWindow.find(AppWindowData.header).html(obj.name);
										newWindow.find(AppWindowData.body).load(obj.url);
										newWindow.find(AppWindowData.headerbar).dragdrop("#"+id);
										newWindow.fadeIn();
										var AddressDiv=$("#"+id+" "+AppWindowData.fulladdress);
										//add back to root button
										AddressDiv.append("<span onclick='resume.FileExplorerNav($(this));' id='FileExplorerGoFolderRoot' data-path='{\"ItemPath\":\""+data.vfspath[0]+"\",\"newWindow\":false}'><img src='./img/app/home.png'></span>");
										//add initial up with 1 directory (same than root at 1st level)
										AddressDiv.append("<span onclick='resume.FileExplorerNav($(this));' id='FileExplorerGoUp' data-path='{\"ItemPath\":\""+data.vfspath[0]+"\",\"newWindow\":false}'><img src='./img/app/up.png'></span>");
										
									},
									"setParentPath": function (AppId, WindowId, Path){
										var AppWindowData = resume.Apps.list[AppId].window;
										var AddressDiv=$("#"+WindowId+" "+AppWindowData.fulladdress);
										AddressDiv.find(AppWindowData.upbutton).remove();
										var PathArr=Path.split(",");
										var PathLen=PathArr.length;
										if (PathLen>1){Path=PathArr.splice(0,PathLen-1).join(",");}
										AddressDiv.append("<span onclick='resume.FileExplorerNav($(this));' id='FileExplorerGoUp' data-path='{\"ItemPath\":\""+Path+"\",\"newWindow\":false}'><img src='./img/app/up.png'></span>");
									}
								},
					"start": function(obj, newWindow, path, strPath){
						var appId=resume.FExtension[obj.type];
						var objData={vfspath:path};
						var TaskData=resume.Apps.appToTask(obj, appId, newWindow, objData, strPath);
						var thisWindow=resume.Apps.list[appId].window;
						$("#"+TaskData[1]+" "+thisWindow.path).val(strPath);
						$("#"+TaskData[1]+" "+thisWindow.header).html(obj.name);
						var winContainer = $("#"+TaskData[1]+" "+thisWindow.body);
						var ContentLen=obj.child.length;
						var newWindow=false;
						thisWindow.setParentPath(appId, TaskData[1], path)
						for (var i=0;i<ContentLen;i++){
							obj.child[i].child ? newWindow=false : newWindow=true
							resume.CreateDesktopIcon(obj.child[i], [path,i], -1, winContainer, newWindow);
						}
					},
					"taskbar": {
						"icon":"folder",
						"maxproc":10						
					}
				},
				"app_terminal":{
					"name": "Terminal",
					"description": "Then unix command.com (Open the shell files too)",
					"window": 	{
									"full": "<div id='TerminalDiv'><div class='WindowHead_Light3'><span style='text-align:left;'><b>Terminal - <span id='WindowTargetFileName'></span></b></span><div style='right:26px;' class='WindowMinimize_Light1' onclick='***'>&#95;</div><div class='WindowClose_Light1' onclick='$$$'>&#10006;</div></div>	<div id='TerminalBackground'></div><div id='TerminalContent'> </div> <div id='TerminalInputLine'><span id='input_prefix'>root@root-desktop:~$</span> <input type='text' id='TerminalInput' value=''></div> </div>",
									"headerbar": ".WindowHead_Light3",
									"header": "#WindowTargetFileName",
									"body": "#TerminalContent",
									"inputline":"#TerminalInputLine",
									"prefix":"#input_prefix",
									"input": "#TerminalInput",
									"size": { "fixed": false, "width": 1000, "height": 500},
									"build": function (obj, AppId, data, id){
										var AppWindowData = resume.Apps.list[AppId].window;
										var NewPosition=resume.Apps.randomWindowPos(AppWindowData.size.width, AppWindowData.size.height);
										var newWindowObj = AppWindowData.full.replace("***", "resume.Apps.minimize(\""+AppId+"\",\""+id+"\");").replace("$$$", "resume.Apps.close(\""+AppId+"\",\""+id+"\");");
										$("#"+resume.Desktop).append("<div id='"+id+"' style='width:"+AppWindowData.size.width+"px;height:"+AppWindowData.size.height+"px;"+NewPosition+"'>"+newWindowObj+"</div>");
										var newWindow=$("#"+id);
										newWindow.on("click", function(e){resume.Apps.focusToWindow(id);});
										newWindow.find(AppWindowData.header).html(obj.name);
										newWindow.find(AppWindowData.inputline).width(AppWindowData.size.width);
										var inputElem = newWindow.find(AppWindowData.input);
										inputElem.width(AppWindowData.size.width-newWindow.find(AppWindowData.prefix).width()-10);
										inputElem.keydown(resume.Apps.list[AppId].NewTeminalLine);
										inputElem.focus();
										newWindow.fadeIn();
										newWindow.find(AppWindowData.headerbar).dragdrop("#"+id);
									}
								},
					"start": function(obj, newWindow, path, strPath){
						var appId=resume.FExtension[obj.type];
						var objData={vfspath:path};
						var TaskData=resume.Apps.appToTask(obj, appId, newWindow, objData, strPath);
						var thisWindow=resume.Apps.list[appId].window;
						$("#"+TaskData[1]+" "+thisWindow.header).html(obj.name);
						$.getJSON(obj.url, function(result){
							var inputElem="#"+TaskData[1]+" "+thisWindow.input;
							var contElem="#"+TaskData[1]+" "+thisWindow.body;
							var readThis=result.text;
							var data = {
									"target": inputElem,
									"container": contElem,
									"text":readThis,
									"delayRange": [10,100],
									"lineEndDelay": 500,
									"lineCommentDelay": 750,	
									"index": 0,
									"max": readThis.length,
									"line": readThis[0][0],
									"setLine": function(n){ this.line=this.text[n][0];}
							};					
							AutoTyper(data);
						});		
					},
					"NewTeminalLine": function (event){
						if(event.keyCode == 13){
							var thisWindow=$(event.target.parentNode.parentNode);
							var input = thisWindow.find("#TerminalInput");
							var prefix = thisWindow.find("#input_prefix");
							var content = thisWindow.find("#TerminalContent");			
							var txt=input.val();
							if (txt.trim().length>0){
								content.html(content.html().trim()+"<br>"+prefix.html()+" "+txt);
								content.scrollTop(1E10);
								input.val("");
							}
						}
					},						
					"taskbar": {
						"icon":"folder",
						"maxproc":10						
					}
				},
				"app_taskmanager":{
					"name": "Task Manager",
					"description": "Administration panel for running tasks",
					"window": 	{
									"full":  "<div id='TaskManagerPanel'>"+
												"<div id='MyWindow' style='position:absolute;'><div class='WindowHead_Light4'><span style='text-align:left;'><b>System - <span id='WindowTargetFileName'></span></b></span><div style='right:26px;' class='WindowMiniButton_Light1' onclick='***'>&#95;</div><div class='WindowMiniButton_Light1' onclick='$$$'>&#10006;</div></div>"+
												"<div class='TaskManagerHeaderRow'>"+
													"<div class='TaskManagerCell'>Task</div>"+
													"<div class='TaskManagerCell'>Stat</div>"+
													"<div class='TaskManagerCell'>ID</div>"+
													"<div class='TaskManagerCell'>Kill</div>"+
												"</div>"+
												"<div id='MyWindowContent' style='position:absolute; left:0px;top:61px;padding: 0;overflow-y: scroll;'>"+
												"</div></div>"+
											"</div>",	
									"headerbar": ".WindowHead_Light4",
									"header": "#WindowTargetFileName",
									"body": "#MyWindowContent",
									"size": { "fixed": false, "width": 500, "height": 600},
									"build": function (obj, AppId, data, id){
										var AppWindowData = resume.Apps.list[AppId].window;
										var NewPosition=resume.Apps.randomWindowPos(AppWindowData.size.width, AppWindowData.size.height);
										var newWindowObj = AppWindowData.full.replace("***", "resume.Apps.minimize(\""+AppId+"\",\""+id+"\");").replace("$$$", "resume.Apps.close(\""+AppId+"\",\""+id+"\");");
										$("#"+resume.Desktop).append("<div id='"+id+"' style='width:"+AppWindowData.size.width+"px;height:"+AppWindowData.size.height+"px;"+NewPosition+"'>"+newWindowObj+"</div>");
										var newWindow=$("#"+id);
										newWindow.on("click", function(e){resume.Apps.focusToWindow(id);});
										newWindow.fadeIn();
										newWindow.find(AppWindowData.headerbar).dragdrop("#"+id);
										resume.TaskManager.id=id;
									}
								},
					"start": function(obj, newWindow, path, strPath){
						var appId=resume.FExtension[obj.type];
						var objData={vfspath:path};
						var TaskData=resume.Apps.appToTask(obj, appId, newWindow, objData, strPath);
						var thisWindow=resume.Apps.list[appId].window;
						$("#"+TaskData[1]+" "+thisWindow.header).html(obj.name);
					},
					"taskbar": {
						"icon":"folder",
						"maxproc":1						
					}
				},	
				"app_display":{
					"name": "Display Settings",
					"description": "Display panel, custumize your desktop",
					"window": 	{
									"full": '<div id="DisplaySettingPanel">'+
											'<div id="MyWindow" style="position:absolute;"><div class="WindowHead_Light4"><span style="text-align:left;"><b>Settings - <span id="WindowTargetFileName"></span></b></span><div style="right:26px;" class="WindowMiniButton_Light1" onclick="***">&#95;</div><div class="WindowMiniButton_Light1" onclick="$$$">&#10006;</div></div>'+
											'<div id="MyWindowContent" style="position:absolute; display: block; left:0px;top:32px;padding: 5px 10px;white-space:normal;">'+
											'<h1>Informations:</h1><table>'+
											'<tr><td>Screen Size:</td><td><span id="Display_Screen_Size">1024 x 768</span></td></tr>'+
											'<tr><td>Window Size:</td><td><span id="Display_Window_Size">1000 x 700</span></td></tr>'+
											'<tr><td>Desktop Size:</td><td><span id="Display_Desktop_Size">900 x 800</span></td></tr>'+
											'<tr><td>Color:</td><td><input type="color" id="Display_Background_Color_Start" onchange="###(false);" value="#0000FF"> <input type="color" id="Display_Background_Color_End" onchange="###(false);" value="#FFFFFF"></td></tr>'+
											'<tr><td>Alpha:</td><td><input type="number" min="0" max="100" value="100" id="Display_Background_Alpha_Start" onchange="###(false);"> <input type="number" min="0" max="100" value="100" id="Display_Background_Alpha_End" onchange="###(false);"></td></tr>'+
											'<tr><td>Gradient:</td><td><input type="number" value="135" id="Display_Gradient_Degree" min="-90" max="180" onchange="###(false);"> deg</td></tr>'+
											'<tr><td>Image:</td><td><select id="Display_Wallpaper_List" onchange="###(false);"><option value="">No image</option></select></td></tr>'+
											'<tr><td>Position:</td><td><select id="Display_Wallpaper_Position" onchange="###(false);">'+
												'<option value="center center">Center Center</option>'+
												'<option value="center top">Center Top</option>'+
												'<option value="center bottom">Center Bottom</option>'+		
												'<option value="left top">Left Top</option>'+
												'<option value="left center">Left Center</option>'+
												'<option value="left bottom">Left Bottom</option>'+
												'<option value="right top">Right Top</option>'+
												'<option value="right center">Right Center</option>'+
												'<option value="right bottom">Right Bottom</option>'+
											'</select></td></tr>'+
											'<tr><td>Size:</td><td>w: <input type="number" value="100" id="Display_Wallpaper_Width" min="0" onchange="###(false);">%, h: <input type="number" value="100" min="0" id="Display_Wallpaper_Height" onchange="###(false);">% </td></tr>'+
											'<tr><td>Repeat:</td><td><select id="Display_Wallpaper_Repeat" onchange="###(false);">'+
												'<option value="no-repeat">Not repeat</option>'+
												'<option value="repeat">Repeat</option>'+
												'<option value="repeat-x">Horizontal</option>'+
												'<option value="repeat-y">Vertical</option>'+
											'</select></td></tr>'+
											'<tr><td>Opacity:</td><td><input type="number" min="0" max="100" value="100" id="Display_Background_Image_Opacity" onchange="###(false);"> %</td></tr>'+
											'</table>'+
											'<div class="Display_Background_Preview"></div>'+
											'<div class="Display_Background_Preview"></div>'+
											'<br><center><div><a href="javascript: void(0)" onclick="###(true);"><button>Apply</button></a></div></center>'+
											'</div></div>'+
										'</div>',		
									"headerbar": ".WindowHead_Light4",
									"header": "#WindowTargetFileName",
									"body": "#MyWindowContent",
									"size": { "fixed": false, "width": 500, "height": 400},
									"build": function (obj, AppId, data, id){
										var AppWindowData = resume.Apps.list[AppId].window;
										var NewPosition=resume.Apps.randomWindowPos(AppWindowData.size.width, AppWindowData.size.height);
										var tmp="resume.Apps.list[\'"+AppId+"\'].ChangePreview";
										var newWindowObj = AppWindowData.full.replace("***", "resume.Apps.minimize(\'"+AppId+"\',\'"+id+"\');").replace("$$$", "resume.Apps.close(\'"+AppId+"\',\'"+id+"\');").replace(/###/g, tmp);
										$("#"+resume.Desktop).append("<div id='"+id+"' style='width:"+AppWindowData.size.width+"px;height:"+AppWindowData.size.height+"px;"+NewPosition+"'>"+newWindowObj+"</div>");
										var newWindow=$("#"+id);
										newWindow.on("click", function(e){resume.Apps.focusToWindow(id);});
										newWindow.fadeIn();
										newWindow.find(AppWindowData.headerbar).dragdrop("#"+id);
										
										var max=resume.WallpaperList.length;
										var sel=newWindow.find("#Display_Wallpaper_List");
										for (var i=0;i<max;i++){
											sel.append($('<option>', {value: resume.WallpaperList[i][1],text: resume.WallpaperList[i][0]}));
										}
									}
								},
					"start": function(obj, newWindow, path, strPath){
						var appId=resume.FExtension[obj.type];
						var objData={vfspath:path};
						var TaskData=resume.Apps.appToTask(obj, appId, newWindow, objData, strPath);
						var thisWindow=resume.Apps.list[appId].window;
						$("#"+TaskData[1]+" "+thisWindow.header).html(obj.name);
						resume.Apps.list[appId].ChangePreview(false);
					},
					"ChangePreview": function (apply){
						var rgb1,rgb2, cssValue, rgbaStart, rgbaEnd, degree, w1, h1, w2, h2;
						var preview1=$(".Display_Background_Preview").eq(0);
						var preview2=$(".Display_Background_Preview").eq(1);
						w1=$("#"+resume.Desktop).width();
						h1=$("#"+resume.Desktop).height();
						w2=preview1.width();
						h2=h1/w1*w2;	
						preview1.height(h2);
						preview2.height(h2);				
						$("#Display_Screen_Size").html(screen.width+" x "+screen.height);
						$("#Display_Window_Size").html($(document).width()+" x "+$(document).height());
						$("#Display_Desktop_Size").html(w1+" x "+h1);
						rgb1=$("#Display_Background_Color_Start").val().substr(1);
						rgbaStart="rgba("+parseInt(rgb1.substr(0,2),16)+","+parseInt(rgb1.substr(2,2),16)+","+parseInt(rgb1.substr(4,2),16)+","+$("#Display_Background_Alpha_Start").val()/100+")";
						rgb2=$("#Display_Background_Color_End").val().substr(1);
						rgbaEnd="rgba("+parseInt(rgb2.substr(0,2),16)+","+parseInt(rgb2.substr(2,2),16)+","+parseInt(rgb2.substr(4,2),16)+","+$("#Display_Background_Alpha_End").val()/100+")";
						degree=$("#Display_Gradient_Degree").val()+"deg";
						
						var backgroundImage=$('#Display_Wallpaper_List').val();
						backgroundImage=="" ? cssValue="none" : cssValue="url('./img/background/"+backgroundImage+"')";
						var width=$('#Display_Wallpaper_Width').val()+"%", height=$('#Display_Wallpaper_Height').val()+"%";
						var repeat=$('#Display_Wallpaper_Repeat').val();
						var position=$('#Display_Wallpaper_Position').val();
						var opacity=$('#Display_Background_Image_Opacity').val()/100;
						var CssObj1={
							"background":"#3578ff;",
							"background":"-moz-linear-gradient("+degree+",  "+rgbaStart+", "+rgbaEnd+")",
							"background":"-webkit-gradient(linear, l"+degree+", "+rgbaStart+", "+rgbaEnd+")",
							"background":"-webkit-linear-gradient("+degree+",  "+rgbaStart+","+rgbaEnd+")",
							"background":"-o-linear-gradient("+degree+",  "+rgbaStart+","+rgbaEnd+")",
							"background":"-ms-linear-gradient("+degree+",  "+rgbaStart+","+rgbaEnd+")",
							"background":"linear-gradient("+degree+",  "+rgbaStart+","+rgbaEnd+")",
							"filter":"progid:DXImageTransform.Microsoft.gradient( startColorstr=#"+rgb1+", endColorstr=#"+rgb2+",GradientType=1 )"				
						}
						
						var CssObj2={
							"background-image": cssValue,
							"background-size": width+" "+height,
							"background-repeat": repeat,
							"background-position": position,
							"opacity": opacity
						}
						
						if (apply) {
							$(".BackgroundDiv").eq(0).css(CssObj1);
							$(".BackgroundDiv").eq(1).css(CssObj2);
							//------------------------------
							//-------------------- save display settins here if you connct with back end ------------
							//------------------------------
						}else{
							preview1.css(CssObj1);
							preview2.css(CssObj2);		
						}	
					},
					"taskbar": {
						"icon":"folder",
						"maxproc":1						
					}
				},					
				"app_link":{
					"name": "Link",
					"description": "Open a new window with short cut link",
					"start": function(obj){
						window.open(obj.url); 
					}
				},
				"app_alert":{
					"name": "Link",
					"description": "Show text in alert box",
					"start": function(obj){
						alert(obj.text);
					}
				}					
			},
	"lastApp":{
		"id": null,
		"popUp": null,
		"focus": null
	},
	"renderTaskListwithButton": function(){
		var max=resume.RunningApps.length||0, maxsub, AppId, taskbarAppButton, taskbarAppList;
		for (var i=0;i<max;i++){
			//declare variables
			AppId=resume.RunningApps[i].appId;
			taskbarAppButton=$(("#tsk_btn_"+AppId+" #taskButtonLink"));
			taskbarAppList=$("#tsk_list_"+AppId);
			//now set width, left position after button
			taskbarAppList.offset({left: taskbarAppButton.offset().left});	
			taskbarAppList.width(taskbarAppButton.width());
		}
		var e=$('#taskGroupListContDiv');
		if ((e.prop("scrollWidth") - e.width())>0){
			$("#TaskBarArrow2").show();
		}else{
			$("#TaskBarArrow1").hide();
			$("#TaskBarArrow2").hide();
		}
	},
	
	"appToTask": function (obj, appId, newWindow, objData, path){
		var taskLen=resume.RunningApps.length, i = 0, TaskId, freeId, taskGroup, max, task, objName;
		while ((!TaskId)&&(i<taskLen)) {
			if (!resume.RunningApps[i]){
				freeId=i;
			}else{
				if (resume.RunningApps[i].appId==appId){
					TaskId=i;
				}
			}
			i++;
		}
		var buttonLabel=resume.Apps.list[appId].name+": "+obj.name;
		var buttonLink="<div id='taskButtonLink' class='TaskBar_TaskGroupButton TaskBarHighlightable'><img src='./img/startmenu/"+resume.Apps.list[appId].taskbar.icon+".png'> "+buttonLabel+"</div>";
		if (TaskId==null){
			if (!freeId){
				TaskId=taskLen;
			}else{
				TaskId=freeId;
			}
			//create group
			resume.RunningApps[TaskId]={
				"appId": appId,
				"taskIcon": resume.Apps.list[appId].taskbar.icon,
				"currentWindow": 0,
				"windows":[]
			};			
			//create ui - create Button on taskbar 
			$("#taskGroupListContDiv").append("<a id='tsk_btn_"+appId+"' title='"+buttonLabel+"'>"+buttonLink+"</a>");
			//create list div for running tasks in this task group
			$("#TaskBar_TaskGroup_TaskList_Container").append("<div id='tsk_list_"+appId+"' class='TaskBar_TaskGroup_TaskList'><ul> </ul></div>");
		}
		
		// store button and list div to variable for easier manage
		var taskbarAppButton=$("#tsk_btn_"+appId);
		var taskbarAppList=$("#tsk_list_"+appId);	
		var windowId=("win_"+resume.GetUniqueId());
		
		//check if need new window or no also if max instance in current application type is reached or no
		taskGroup=resume.RunningApps[TaskId];
		max=taskGroup.windows.length;
		//check if it is already opened, if now then check if need new window, or use current one
		entryExist=resume.Apps.findTask(appId, ["path",path]);
		if (newWindow === true){
			if (entryExist[0]===true){
				var existWinId=resume.RunningApps[entryExist[1]].windows[entryExist[2]].id;
				taskGroup.windows[entryExist[2]].minimize === true ? setTimeout(function (){resume.Apps.restore(appId, existWinId)}, 100) : setTimeout(function(){resume.Apps.focusToWindow(existWinId)}, 100)
			}else{
				resume.Sound.Play(0);
				if (max < resume.Apps.list[appId].taskbar.maxproc){
					var winMax=taskGroup.windows.length;
					//refresh the text for taskgroup button
					taskbarAppButton.html(buttonLink);
					//create a new instance object in current taskgroup
					obj.child || obj.hidetype ? objName=obj.name : objName=obj.name+"."+obj.type;
					taskGroup.windows[max]={
						"id": windowId,
						"data": objData,
						"path": path,
						"taskbarIcon": obj.icon,
						"name": objName,
						"minimize": false,
						"description": obj.description				
					};
					
					//only for keep track what is the current visible window
					taskGroup.currentWindow=max;
					//create the new WINDOW :)
					resume.Apps.list[appId].window.build(obj, appId, objData, windowId);
					//create list buttons - create a button for current newly created window on task list in current task group, make event if clicked to it then window will be restored
					$("#tsk_list_"+appId+" ul").append("<li class='TaskBarHighlightable' onclick='resume.Apps.restore(\""+appId+"\",\""+windowId+"\");'><a title='"+buttonLabel+"'><img src='./img/startmenu/"+obj.icon+".png'> "+buttonLabel+"</a></li>");
					//render - organize the tasklists position/width after taskgroup position/width and add click event
					resume.Apps.renderTaskListwithButton();
					//focus to new window (focused window got z-index:3, non focused got z-index:2)
					setTimeout(function (){resume.Apps.focusToWindow(windowId)}, 100);					
					return [true,taskGroup.windows[max].id];
				}else{
					alert("Cannot start more window");
					return [false];				
				}
			}
		}else{
			var currentWindow = taskGroup.currentWindow || 0;
			if (taskGroup.windows[currentWindow]){ 
				thisWindow=taskGroup.windows[currentWindow];
				windowId=thisWindow.id;
				//clear the current window body container
				$("#"+windowId+" "+resume.Apps.list[appId].window.body).empty();
				//fix the name for button
				obj.child ? objName=obj.name : objName=obj.name+"."+obj.type;
				buttonLabel=resume.Apps.list[appId].name+": "+objName;
				//refresh the task path/target file or folder name/description
				thisWindow.path=path;
				thisWindow.name=objName;
				thisWindow.data=objData,
				thisWindow.description=obj.description;
				taskbarAppButton.html(buttonLink);
				//used .replaceWith but that will be cached so  i use.html for replace the button name in tasklist for this taskgroup
				$("#tsk_list_"+appId+" ul li a").eq(currentWindow).html("<img src='./img/startmenu/"+obj.icon+".png'> "+buttonLabel);
				resume.Apps.renderTaskListwithButton();	
				return [true,taskGroup.windows[currentWindow].id];				
			}else{
				alert("Error, the instance was closed");
				return [false];
			}
			
		}
	},			
	// find task/app from RunningApps array, if not found return false, else return true and path to target app and attached data to running task
	"findTask": function(AppId, target){
		var max=resume.RunningApps.length, maxsub;
		for (var i=0;i<max;i++){
			if (resume.RunningApps[i].appId==AppId){
				maxsub=resume.RunningApps[i].windows.length;
				for (var x=0;x<maxsub;x++){
					if (resume.RunningApps[i].windows[x][target[0]]==target[1]){
						return [true,i,x,resume.RunningApps[i].windows[x].data || ""];
						break;
					}
				}
			}
		}
		return [false];
	},
	"close": function (AppId, WindowId){
		//normal case just remove the button from task list and set few thing
		//advanced case if task is the only from group, then we need remove the taskgroup button too
		//check if it exist, if yes then e get the position in object for taget window what we want close
		taskStatus=resume.Apps.findTask(AppId, ["id",WindowId]);
		if (taskStatus[0]===true){
			resume.Sound.Play(1);
			ourGroup=resume.RunningApps[taskStatus[1]];
			max=resume.RunningApps[taskStatus[1]].windows.length;
			windowList=resume.RunningApps[taskStatus[1]].windows;
			//if have more window in group then remove only 1, else must remove list with button aswell
			if (max>1){
				windowList.splice(taskStatus[2], 1);
				resume.RunningApps[taskStatus[1]].currentWindow=0;
				var nextButton;
				//if the windows closed the change the task group button name because the current task window name not valid anymore
				taskStatus[2]==0 ? nextButton=1 : nextButton=0
				TaskGroupButton=$("#tsk_btn_"+AppId+" #taskButtonLink");
				TaskListButton=$("#tsk_list_"+AppId+" li").eq(nextButton);
						TaskGroupButton.off();
						TaskGroupButton.html(TaskListButton.find("a").html());
						TaskGroupButton.on("click", {appId:AppId}, function(event){
							var id=event.data.appId;
							$("#tsk_list_"+id).toggle();
							resume.Apps.lastApp.id=id;
							resume.Apps.lastApp.popUp=true;				
						});					
			}else{
				taskbarAppButton=$("#tsk_btn_"+AppId);
				taskbarAppButton.off();
				taskbarAppButton.remove();
				taskbarAppList=$("#tsk_list_"+AppId);
				taskbarAppList.off();
				taskbarAppList.remove();
				windowList.splice(taskStatus[2], 1);
				resume.RunningApps.splice(taskStatus[1], 1);
				resume.Apps.renderTaskListwithButton();
			}
			$("#tsk_list_"+AppId+" ul li").eq(taskStatus[2]).remove();
			if (resume.TaskManager.id==WindowId){resume.TaskManager.id=null;}
			$("#"+WindowId).remove();
		}else{
			alert("not found");
		}
		
		
		if (taskStatus[0]===true){
			//alert("exist");
		}else{
			//alert("not found");
		}
	},
	closeApp(AppId){
		var max=resume.RunningApps.length, maxsub, windowId;
		for (var i=0;i<max;i++){
			if (resume.RunningApps[i].appId==AppId){
				maxsub=resume.RunningApps[i].windows.length;
				for (var x=0;x<maxsub;x++){
					windowId=resume.RunningApps[i].windows[0].id;
					resume.Apps.close(AppId, windowId);
				}
				return true;
			}
		}	
		return false;		
	},	
	"focusToWindow": function (TargetWindowId){
		//e.stopPropagation();
		//e.preventDefault();
		var TaskGroupButton, TaskListButton, appId, thisWin, TaskStatus, AppName;
		$("#TaskManagerPanel #MyWindowContent").html("");
		if (resume.Apps.lastApp.focus != TargetWindowId){
			var max=resume.RunningApps.length, maxsub, winId, win;
			for (var i=0;i<max;i++){
				AppId=resume.RunningApps[i].appId;
				AppName=resume.Apps.list[AppId].name;
				maxsub=resume.RunningApps[i].windows.length;
				if (resume.TaskManager.id){
					$("#"+resume.TaskManager.id+" #MyWindowContent").append('<div class="TaskManagerRow">'+
					'<div class="TaskManagerCell">'+AppName+'</div>'+
					'<div class="TaskManagerCell">Group</div>'+
					'<div class="TaskManagerCell">'+i+'</div>'+
					'<div class="TaskManagerCell"><div class="WindowMiniButton_Light12" onclick="resume.Apps.closeApp(\''+AppId+'\');">&#10006;</div></div>'
					);
				}
				TaskGroupButton=$("#tsk_btn_"+AppId+" #taskButtonLink");
				if (TaskGroupButton.hasClass('TaskBarHighlighted')) {TaskGroupButton.removeClass("TaskBarHighlighted");}
				for (var x=0;x<maxsub;x++){
					TaskListButton=$("#tsk_list_"+AppId+" li").eq(x);
					thisWin = resume.RunningApps[i].windows[x];
					winId = thisWin.id;
					win = $("#"+winId);
					if (winId==TargetWindowId) {
						win.css("z-index", "3");
						resume.RunningApps[i].currentWindow=x;
						//highligt the active taskgroup and task list button
						TaskListButton.addClass("TaskBarHighlighted");
						TaskGroupButton.addClass("TaskBarHighlighted");
						//change the task group button text to current task button text and remove/readd click event for avoid the bug
						TaskGroupButton.off();
						TaskGroupButton.html(TaskListButton.find("a").html());
						TaskGroupButton.on("click", {appId:AppId}, function(event){
							var id=event.data.appId;
							$("#tsk_list_"+id).toggle();
							resume.Apps.lastApp.id=id;
							resume.Apps.lastApp.popUp=true;				
						});
						TaskStatus="Focused";
					}else{
						if (TaskListButton.hasClass('TaskBarHighlighted')) {TaskListButton.removeClass("TaskBarHighlighted");}
						win.css("z-index", "2");
						thisWin.minimize===true ? TaskStatus="Minimized" : TaskStatus="Background"
					}
					if (resume.TaskManager.id){
						$("#"+resume.TaskManager.id+" #MyWindowContent").append('<div class="TaskManagerRow">'+
						'<div class="TaskManagerCell"> &#187; '+AppName+": "+thisWin.name+'</div>'+
						'<div class="TaskManagerCell">'+TaskStatus+'</div>'+
						'<div class="TaskManagerCell">'+x+'</div>'+
						'<div class="TaskManagerCell"><div class="WindowMiniButton_Light12" onclick="resume.Apps.close(\''+AppId+'\',\''+winId+'\');">&#10006;</div></div>'
						);
					}
				}
			}	
		}
	},
	"randomWindowPos": function (width, height){
		var rnd=Math.round(Math.random()*3);
		var pos={
			"a": "position:absolute;",
			"x": Math.round(Math.random()*100)+20,
			"y": Math.round(Math.random()*100)+60
		};
		switch(rnd){
			case 0:
				return pos.a+"top:"+pos.y+"px;left:"+pos.x+"px;";
				break;
			case 1:
				return pos.a+"top:"+pos.y+"px;right:"+pos.x+"px;";
				break;
			case 2:
				return pos.a+"bottom:"+pos.y+"px;left:"+pos.x+"px;";
				break;
			case 3:
				return pos.a+"bottom:"+pos.y+"px;right:"+pos.x+"px;";
				break;
		}
		return "";
	},	
	"restore": function (AppId, WindowId){
		var selectedWindow=$("#"+WindowId);
		var taskStatus=resume.Apps.findTask(AppId, ["id", WindowId]);
		if (taskStatus[0]===true){
			resume.Sound.Play(0);
			resume.Apps.focusToWindow(WindowId);
			resume.RunningApps[taskStatus[1]].currentWindow=taskStatus[2];
			if (resume.RunningApps[taskStatus[1]].windows[taskStatus[2]].minimize!=false){
				resume.RunningApps[taskStatus[1]].windows[taskStatus[2]].minimize=false;
				selectedWindow.fadeIn();
			}
		}
		setTimeout(function (){resume.Apps.focusToWindow(WindowId)}, 100);	
	},
	"minimize": function (AppId, WindowId){
		var selectedWindow=$("#"+WindowId);
		var TaskGroupButton, TaskListButton;
		selectedWindow.fadeOut();
		selectedWindow.css("z-index", "2");
		taskStatus=resume.Apps.findTask(AppId, ["id", WindowId]);
		if (taskStatus[0]===true){
			resume.Sound.Play(1);
			resume.RunningApps[taskStatus[1]].windows[taskStatus[2]].minimize=true;
			resume.Apps.lastApp.focus=-1;
			TaskListButton=$("#tsk_list_"+AppId+" li").eq(taskStatus[2]);
			TaskGroupButton=$("#tsk_btn_"+AppId+" #taskButtonLink");
			setTimeout(function(){
				if (TaskListButton.hasClass('TaskBarHighlighted')) {TaskListButton.removeClass("TaskBarHighlighted");}
				if (TaskGroupButton.hasClass('TaskBarHighlighted')) {TaskGroupButton.removeClass("TaskBarHighlighted");}
			}, 100);
			
		};
		(function(){
				var t = new Date();
				var y = t.getFullYear();
				var m = t.getMonth();
				var d = t.getDate();
				var myAge = y-1987-1;
				((m > 4)||((m==4)&&(d>=18))) ? myAge++ : null
				$("#MyCurrentAge").html(myAge);
		}()); 		
	}
	
};

$.fn.dragdrop = function (el) {
	
    this.bind('mousedown', function (e) {
		resume.Apps.focusToWindow(el.substr(1));
        var relX = e.pageX - $(el).offset().left;
        var relY = e.pageY - $(el).offset().top;
        var maxX = $('body').width() - $(el).width() - 10;
        var maxY = $('body').height() - $(el).height() - 50;
        $(document).bind('mousemove', function (e) {
            var diffX = Math.min(maxX, Math.max(0, e.pageX - relX));
            var diffY = Math.min(maxY, Math.max(0, e.pageY - relY));
            $(el).css('left', diffX + 'px').css('top', diffY + 'px');
        });
    });
    $(window).bind('mouseup', function (e) {
        $(document).unbind('mousemove');
    });
    return this;
};

AutoTyper = function (data) {
	(function readLine (data){
		if (data.line.length>0){
			if ($(data.target).length){
				var delay=Math.random()*(data.delayRange[1]-data.delayRange[0])+data.delayRange[0];
				setTimeout(function () {
					$(data.target).val($(data.target).val()+data.line.charAt(0));
					data.line=data.line.substr(1);
					readLine(data);
				}, delay);
			}else{
				//if element not exist, example during autowriteing someone close the window
				data=null;
			}
		}else{
			setTimeout(function () {
				$(data.container).html($(data.container).html()+$(data.target).val());
				$(data.target).val("");
				setTimeout(function () {
					if (data.text[data.index][1].length > 0) {
						$(data.container).html($(data.container).html()+"<br><font color='gray'>"+data.text[data.index][1]+"</font><br><br>");
					}else{
						$(data.container).html($(data.container).html()+"<br>");
					}
					$(data.container).scrollTop(1E10);
					var delay=data.text[data.index][1].length*50+1000;
					data.index++;
					if (data.index < data.max){
						setTimeout(function () {
						data.setLine(data.index);
						readLine(data);
						}, delay);
					}else{
						setTimeout(function () {
							//done, we quit
							$(data.container).html($(data.container).html()+"<br> ... finished");
							$(data.container).scrollTop(1E10);
							data=null;
						}, delay);							
					}
				}, data.lineCommentDelay);
			}, data.lineEndDelay);
		}						
	})(data);
};
	/*
	//this is a array sort after a class from object
	function dynamicSort(property) {
		var sortOrder = 1;
		if(property[0] === "-") {
			sortOrder = -1;
			property = property.substr(1);
		}
		return function (a,b) {
			var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			return result * sortOrder;
		}
	}
	
	obj.sort(dynamicSort("objclass"));
	*/