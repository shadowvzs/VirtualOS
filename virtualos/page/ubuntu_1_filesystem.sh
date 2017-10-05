{
"text":
[
["cd myFolder","enter from current directory to <b>myFolder</b> directory"],
["cd /home/pista/myFolder","enter from root to <b>myFolder</b> what is in <b>home/pista</b>directory, it is similiar like <b>c:\\home\\pista\\myFolder</b> in windows"],
["sudo chmod -R 777 ./myFolder","<b>sudo</b> this mean then command after sudo will executed with admin right<br><b>chmod</b> change the file/folder/path read and write permissions<br><b>-R</b> mean not only to folder apply but also for every sub file/folder<br><b>./</b> before path mean it is from current folder, <b>../</b> parent directory of current directory, if you use <b>/</b> then it from root"],
["sudo chown -R pista ./myFolder","<b>sudo</b> this mean then command after sudo will executed with admin right<br><b>chown</b> change the file/folder/path owner<br><b>-R</b> mean not only to folder apply but also for every sub file/folder<br><b>pista</b> is the linux user who will get the ownership"],
["sudo chgrp -hR newbies ./myFolder","<b>chgrp</b> change the file/folder/path owner group<br><b>-hR</b> mean not only to folder apply but also for every sub file/folder<br><b>newbies</b> is the linux usergroup whos will get the ownership"],
["sudo ls","list the current folder content"],
["cp input.txt newname.txt","it's copy <b>input.txt</b> to same folder and copied filename will be <b>newname.txt</b>"],
["cp ./myfolder/*.txt ./backup","it's copy all <b>.txt</b> from <b>myfolder</b> to <b>backup</b> directory"],
["cp -R ./* /home/pista/desktop","copy every file from current directory to <b>/home/pista/desktop</b> directory"],
["mv pista.txt ./myfolder","move <b>pista.txt</b> to <b>myfolder</b>"],
["mkdir myfolder","create <b>myfolder</b> directory"],
["rm -f pista.txt","delete file or folder (if folder not emptry then use <b>-R</b> or <b>-f</b> if you want forced deletion)"],
["dpkg -i *.deb","install every debian (<b>.deb</b>) package from current directory"],
["tar -xzf myarchive.tar.gz -C ./myFolder","extract myarchive.tar.gz with folders to <b>myFolder</b>"],
["tar -zcvf myarchive.tar.gz ./myFolder","create archive from <b>myFolder</b> folder with <b>myarchive</b> file name and <b>.tar.gz</b> file extension"],
["nano myfile.txt","edit <b>myfile.txt</b> (close with <b>ctrl+x</b>)"],
["sed s/oldtext/newtext/g ./mytextfile.txt > ./newtextfile.txt","search and replace every <b>oldtext</b> to <b>newtext</b> from <b>mytextfile.txt</b> and output will be wrote to <b>newtextfile</b>"],
["echo $(ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')","show the current ip (could be lan ip if pc is in lan)<br>withou echo you can store in variable if you use a shell file"],
["echo $(cat /etc/iweb.conf | grep -m 1 address)| cut -d' ' -f 3","open <b>/etc/iweb.conf</b><br>search after <b>address</b> text and grab that line<br>split/explode line with \" \" character and return the 3rd index"],
["wget -c http://www.example.org/files/archive.zip","download <b>archive.zip</b> (<b>-c</b> if it was interupted then continue from last download stat)"],
["sed -i 's/\r$//' shellfile.sh","convert line ending to unix line ending in <b>shellfile.sh</b> file<br><b>Note:</b> shell file cannot run with windows line ending"]
]
}
