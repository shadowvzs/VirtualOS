
	var resume={
		SelStartMenuCat:"",
		MouseInStartMenu:false,
		StartMenuUp:false,
		SettingsID:-1,
		Database:[],
		Apps:{},
		RunningApps:[],
		FExtension:{},
		CodeSchoolData:{},
		Desktop:"DesktopContainer",
		Sound: {
			File: [(new Audio("./mp3/click.mp3")), (new Audio("./mp3/close.mp3"))],
			Visible: false,
			Volume: 0.2,
			Play: function(i){
				if (resume.Sound.Volume>0){
					resume.Sound.File[i].volume=resume.Sound.Volume; 
					resume.Sound.File[i].play();
				}				
			}
		},
		startClock:function () {
			var time = new Date();
			var out=(
			("0" + time.getHours()).slice(-2)   + ":" + 
			("0" + time.getMinutes()).slice(-2) + ":" + 
			("0" + time.getSeconds()).slice(-2));
			$("#TaskTimeDate").text(out);
			$("#TooltipTime").text(out);
			t = setTimeout(function() {
				resume.startClock()
			}, 1000);
		},
		setTooltipDate: function (){
			var time = new Date();
			var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
			var months = ["January","February","March","April","May","June","July","August", "September", "October", "November", "December"];
			var out = time.getFullYear()+" "+months[time.getMonth()]+" "+time.getDate()+" ("+days[time.getDay()]+")";
			
			var TimeZoneDiff=time.getTimezoneOffset();
			TimeZoneDiff=Math.round(TimeZoneDiff/60);
			TimeZoneDiff>0 ? TimeZoneDiff="-"+TimeZoneDiff : TimeZoneDiff="+"+(TimeZoneDiff*-1)
			
			$("#TooltipTimeZone").text(" (GMT "+TimeZoneDiff+")");
			$("#TooltipDate").text(out);
		},
		GetDateFromTimestamp: function(tstamp){
			var d=new Date(tstamp*1000);
			return (d.getFullYear()+". "+("0" +(d.getMonth()+1)).slice(-2)+". "+("0" +(d.getDay()+1)).slice(-2)+".  "+("0" + d.getHours()).slice(-2)+":"+("0" + d.getMinutes()).slice(-2)+":"+("0" + d.getSeconds()).slice(-2));
		},
		SelectStartMenuCat:function (id){
			if (id!=resume.SelStartMenuCat){
				var s;
				if (resume.SelStartMenuCat != ""){
					s="#"+resume.SelStartMenuCat;
					$(s).css("display", "none");
					$(s+"_MC").removeClass("TaskBar_SelectStartMenuCat");
				}
				resume.SelStartMenuCat=id;
				s="#"+id;
				$(s+"_MC").addClass("TaskBar_SelectStartMenuCat");
				$(s).css("display", "block");
			}
		},	
		LoadApps:function(){
			$.ajax({
				url: './db/app.js',
				dataType: 'script',
				success: function (response){}
			});	
			
		},
		LoadFileExtensionList:function(){
			$.getJSON("./db/f_ext.json", function(result){
				resume.FExtension=result;
			});
		},		
		LoadFileSystem:function(){
			$.getJSON("./db/vfs.json", function(result){
				resume.Database=result.child;
				$("#TaskBar_StartMenuCatListDiv").empty();
				$("#DesktopContainer").empty();
				$("#TaskBar_StartMenuItemListDiv").empty();
				$("#TaskBar_StartMenuCatListDiv").append("<ul></ul>");
				var StartMenuCatList=$("#TaskBar_StartMenuCatListDiv").find("ul");
				var StartMenuItemList=$("#TaskBar_StartMenuItemListDiv");
				var CountedFolders=result.child.length;
				var CountedFiles, obj, showThisList=true;
				for (var i=0;i<CountedFolders;i++){
					obj=result.child[i];
					if ((obj.onstartmenu)&&(obj.child)){
						newLI="<li data-catid='"+obj.id+"' onmouseover='resume.SelectStartMenuCat($(this).data(\"catid\"));' id='"+obj.id+"_MC'><a title='"+obj.description+"'><img src='./img/startmenu/"+obj.icon+".png'> "+obj.name+"</a></li>";
						StartMenuCatList.append(newLI);
						if (obj.child){
							CountedFiles=obj.child.length;
							if (CountedFiles>0){
								if (showThisList) {
									resume.SelStartMenuCat=obj.id;
									showThisList=false;
									StartMenuItemList.append("<ul id='"+obj.id+"' style='display:block;'></ul>");
								}else{
									StartMenuItemList.append("<ul id='"+obj.id+"' style='display:none;'></ul>");
								}

								for (var x=0;x<CountedFiles;x++){
									if (obj.child[x].onstartmenu){
										newLI="<li data-path='{\"ItemPath\":\""+i+","+x+"\",\"newWindow\":true}' onclick='resume.Execute($(this).data(\"path\"));resume.Sound.Play(0);resume.FadeStartMenu();'><a title='"+obj.child[x].description+"'><img src='./img/startmenu/"+obj.child[x].icon+".png' width='22' height='22'> "+obj.child[x].name+"</a></li>";
										$("#"+obj.id).append(newLI);
									}
									
								}
							}
						}
					}
					if (obj.ondesktop){
						resume.CreateDesktopIcon(obj, i, -1, $("#DesktopContainer"), true);
					}else if (obj.settings){
						Button=$("#SM_Settings");
						resume.SettingsID=i;
						Button.on("click", function (){
							var obj=JSON.parse('{"ItemPath":"'+resume.SettingsID+'","newWindow":true}');
							resume.Execute(obj);
						});
					}
				}
			});
		},
		
		IconNameInputShowChange: function($obj){
			var inp=$obj.find("input");
			$obj.find("span").hide();
			inp.show().focus();
			inp.on('keyup', function (e) {
				if((e.which == 13)||(e.which == 27)){
					$(this).blur();
					$(this).focusout();
					$(this).off("keyup")
				}
			});			
		},
		IconNameChangeSave: function($obj){
			var ItemPath = $obj.closest(".DesktopIconBox").find("a").first().data("path").ItemPath.split(",");
			var inp=$obj.find("input");
			var spn=$obj.find("span");
			var newName=resume.SafeName(inp.val());
			if (newName  == "") {newName="New";}
			var len = ItemPath.length,ExecTarget=resume.Database[ItemPath[0]];
			for (var i=1;i<len;i++){
					ExecTarget=ExecTarget.child[ItemPath[i]];
			}
			
			//------- SAVE to object. so this way the "resume.Database" also updated
			// here need wait for response if someone want connect with backend part
			ExecTarget.name=newName;
			//----------------
		
			spn.text(newName).show();
			inp.val(newName).hide();
		},
		CreateDesktopIcon(item, ItemPath1, ItemPath2, targetContainer, newWindow){
			if (!item.hidden){
				ItemPath2 != -1 ? ItemPath1 +="," : ItemPath2=""
				var tooltip="Description: "+item.description+"&#013;Type: "+item.type+"&#013;Status: ";
				item.readonly ? tooltip+="readonly" : tooltip+="writeable"
				item.child ? tooltip+="&#013;Content: &nbsp;"+item.child.length+" file(s) or folder(s)&#013;" : null;
				tooltip+="&#013;Created at: "+resume.GetDateFromTimestamp(item.createtime)+"&#013;Modified at: "+resume.GetDateFromTimestamp(item.lastmodify);
				targetContainer.append("<div id='"+item.id+"_DE' class='DesktopIconBox'><a title='"+tooltip+"' data-path='{\"ItemPath\":\""+ItemPath1+ItemPath2+"\",\"newWindow\":"+newWindow+"}' onclick='resume.FileExplorerNav($(this));'><div class='DesktopIconImgBox'><img src='./img/desktop/"+item.icon+".png'></div></a><a title='"+item.name+"'><div class='DesktopIconTextBox'><input type='text' maxlength='24' value='"+item.name+"' onfocusout='resume.IconNameChangeSave($(this).parent());'><span onclick='resume.IconNameInputShowChange($(this).parent());'>"+item.name+"</span></div></a></div>");
				$( "#"+item.id+"_DE" ).contextmenu(function() {
					alert( "Handler for .contextmenu() called." );
				});		
			};
		},
		FadeStartMenu: function(){
			$("#TaskBar_StartMenuDiv").fadeOut();
		},
		FileExplorerNav: function($obj){
			resume.Execute($obj.data("path"));
		},		
		Execute: function(obj){
			var ItemPath = obj.ItemPath.split(",");
			var len = ItemPath.length,ExecTarget=resume.Database[ItemPath[0]],FullStringPath="/"+ExecTarget.name;
			if (len>0){
				for (var i=1;i<len;i++){
					ExecTarget=ExecTarget.child[ItemPath[i]];
					FullStringPath+="/"+ExecTarget.name;
				}
				!resume.FExtension[ExecTarget.type] ? alert("No app for this file type...") : resume.Apps.list[resume.FExtension[ExecTarget.type]].start(ExecTarget, obj.newWindow, obj.ItemPath, FullStringPath)
			}
		},
		GetUniqueId: function(){
			return Date.now();
		},
		SafeName: function(str){
			return str.replace(/'/g, "").replace(/"/g, '').trim();
		},
		CheckAppRunning: function(id){
			var crApps=resume.RunningApps.length;	//currently running apps amount
			if (resume.RunningApps.length == 0){
				return [false];
			}else{
				for (var i=0;i<crApps;i++){
					if (resume.RunningApps[i].appId == id) {return [true, resume.RunningApps[i].focused];}
				}
				return [false];
			}
		},		
		LoadCodeSchoolBadge: function(){
			$.ajax({
				url: 'https://www.codeschool.com/users/shadowvzs.json',
				dataType: 'jsonp',
				success: function(response) {
					resume.CodeSchoolData=response;
					//response.courses.completed;
				}
			});		
		},
		SetVolume: function(){
			var val=$("#VolumeInputBar").val();
			if ((resume.Sound.Volume>0)&&(val==0)){
				$("#SM_SoundIcon").attr("src","./img/startmenu/soundoff.png");
			}else if((resume.Sound.Volume==0)&&(val>0)){
				$("#SM_SoundIcon").attr("src","./img/startmenu/soundon.png");
			}
			resume.Sound.Volume=val/100;
			$("#VolumeAmount").html(val+"%");
		},
		SystemInit:function(){
			resume.LoadFileExtensionList();
			resume.LoadFileSystem();	
			resume.LoadApps();			
			resume.startClock();
			resume.setTooltipDate();
			//we assign several event
			$("#VolumeInputBar").val(resume.Sound.Volume*100);
			resume.SetVolume();
			$("#VolumeControlDiv").offset({left: $("#SM_Sound").offset().left});	
			$("#VolumeControlDiv").hide();
			$(document).on("click",function(event) {
				var dv="#TaskBar_StartMenuDiv";
				
				if ((resume.StartMenuUp)&&($(dv).css('opacity') != 0)&&(!resume.MouseInStartMenu)){
					$(dv).fadeOut();
					resume.StartMenuUp=false;
				}
				
				if ((resume.Apps.lastApp.popUp===true)&&(event.target.id!="taskButtonLink")){
					resume.Apps.lastApp.popUp=false;
					$("#tsk_list_"+resume.Apps.lastApp.id).hide();
				}
				//we need add every sub element here, becaue we dont want hide if sub element in VolumControlDiv was clicked
				if ((resume.Sound.Visible===true)&&(event.target.id!="VolumeControlDiv")&&(event.target.id!="VolumeInputBar")&&(event.target.id!="VolumeAmount")&&(event.target.id!="SM_Sound")&&(event.target.id!="SM_SoundIcon")){
					resume.Sound.Visible=false;
					$("#VolumeControlDiv").hide();
				}				
				
			});					
		}
	};
	