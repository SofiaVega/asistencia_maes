
/*function waitForElement(elementPath, callBack){
    //console.log("Waiting for: " + elementPath)
    
    let waitfor=elementPath==='[data-call-ended = "true"]'?10000:1000
    //let maxWait=waitfor==1000?10:null
    
    window.setTimeout(function(){
        //console.log('numChecks: '+numChecks)
        let itExists = document.querySelector(elementPath)
        //if( numChecks < maxWait && (!itExists || itExists.length === 0)) {
        if( !itExists || itExists.length === 0 ) {
            //numChecks++
            waitForElement(elementPath, callBack);
        }
        else{
            //numChecks=null
            callBack(elementPath, itExists);
        }
    },waitfor)
}
function wait4Meet2End(){
    // wait until the meeting is done
    waitForElement('[data-call-ended="true"]',function(){
        write2log( '**** Meet ended ****' )
        hideUpdateText()
        let a_div = document.getElementById("gma-attendance-fields")
        a_div.style = ''
        a_div.classList.remove('in-meeting')
        a_div.classList.add('meeting-over')
        document.getElementById('save-csv-file').style.visibility = 'visible'
        document.getElementById('save-html-file').style.visibility = 'visible'
        document.getElementById("gma-attendance-fields").classList.remove('in-meeting')

        window.clearInterval(monitoring)
        let now = new Date(), ctime = now.getHours()+':'+twod(now.getMinutes())
        sessionStorage.setItem( 'Meeting-end-time', ctime )
        chrome.storage.sync.get(['auto-save-html','auto-save-csv'], function(r) {
            let asf='', svn=0, asfh=5000
            if( !!r['auto-save-html'] && gmaEnabled){
                saveHTMLFile()
                svn+=1
            }
            if( !!r['auto-save-csv'] && gmaEnabled){
                saveCSVFile()
                svn+=2
            }
            if(!gmaEnabled){
                asf="Nothing to save... Attendance was disabled!"
            }
            else if (svn==0){
                asf="Don't forget to save your files!"
                asfh=30000
                document.getElementById('save-html-file').classList.add('save-needed')
                document.getElementById('save-csv-file').classList.add('save-needed')
            }
            else if(svn==1){
                asf="Auto-saved your HTML file"
                document.getElementById('save-csv-file').classList.add('save-needed')
            }
            else if(svn==2){
                asf="Auto-saved your CSV file"
                document.getElementById('save-html-file').classList.add('save-needed')
            }
            else if(svn==3){
                asf="Auto-saved your HTML & CSV files"
            }
            document.getElementById('add-class-message').innerText=asf
            document.getElementById('add-class-message').classList.add('bold')
            write2log( 'Auto-save: '+ svn )
            autoHideAddClassMessage(asfh)
        })
    });
}
function wait4Meet2Start(){
    // wait until the meeting has started
    
    write2log( 'Waiting for the Meet to start' )
    waitForElement("[data-allocation-index]",function(){
        write2log( '**** Meet started ****' )
        
        if(!gmaEnabled){
            
            document.getElementById('gma-attendance-fields').style.display='none'
            wait4Meet2End()
            return false
        }
        //document.getElementById('check-attendance').style.visibility = 'visible'
        document.getElementById('start-time').style.visibility = 'visible'
        document.getElementById("gma-attendance-fields").classList.add('in-meeting')

        if(!sessionStorage.getItem('Meeting-start-time') || sessionStorage.getItem('Meeting-start-time') === ''){
            setStartTime()
        }
        else {
            let meetingStart=sessionStorage.getItem('Meeting-start-time')
            document.getElementById('start-time').style.visibility = 'visible'
            document.getElementById('start-time').title = 'Current start time is: ' + meetingStart
            document.getElementById('sp-start-time').innerText = meetingStart
            updateDuration()
        }
        write2log( 'Video portion of Meet started at : ' + sessionStorage.getItem('Meeting-start-time') )
        
        chrome.storage.sync.get(['draggable-top','draggable-left'], function(r) {
            if(!!r['draggable-top']){
                //console.log('top',r['draggable-top'])
                document.getElementById("gma-attendance-fields").style.top=r['draggable-top']
            }
            if(!!r['draggable-left']){
                //console.log('left',r['draggable-left'])
                document.getElementById("gma-attendance-fields").style.left=r['draggable-left']
            }
        })
        
        startMonitoring()
        
        insertAttendanceSwitch()

        let ct = document.getElementById('invited-list').value.trim()
        if(ct !== ''){
            document.getElementById("gma-attendance-fields").classList.remove('empty')
        }
        checkParticipants()  // Check as soon as you join the Meet


        // Create an observer instance to look for changes within the Meet page (detect new participants)
        var observer = new MutationObserver(function( mutations ) {
            checkParticipants()  // Check when ever there is an update to the screen

        });
        // watch for changes (adding new participants to the Meet)
        observer.observe(document.body, {childList:true, attributes:true, attributeFilter: ['data-self-name','data-participant-id','data-requested-participant-id'], subtree:true, characterData:false});
        
        showMeetingStarted() // --> updates.js
        
        wait4Meet2End()
        
    })
}*/
/*
waitForElement("[data-in-call]",function(){
    alert("Hola mundito");
    /*createAttendanceFields()
    setClassList('select-class')
    
    let _activeMeetID=document.querySelector('[data-unresolved-meeting-id]').getAttribute('data-unresolved-meeting-id')
    let smids=sessionStorage.getItem('_activeMeetIDs')
    if( !smids || smids==='' ){
        //sessionStorage.removeItem( 'GMA-Log' )
        write2log( 'Opened a new Meet: '+_activeMeetID )
        sessionStorage.setItem( '_activeMeetIDs', _activeMeetID )
    }
    else if( smids===_activeMeetID ){
        write2log( 'Rejoined Meet: '+_activeMeetID )
    }
    else{
        write2log( 'Joined a different Meet --> previous: '+smids+' / current: '+_activeMeetID+'... resetting _arrivalTimes' )
        sessionStorage.setItem( '_activeMeetIDs', _activeMeetID )
        let _arrivalTimes = {}
        sessionStorage.setItem( '_arrivalTimes', null )
    }
    
    chrome.storage.sync.get(['Current-Class-Code'], function (r) {
        let ccc=sessionStorage.getItem('_Class4ThisMeet')||r['Current-Class-Code']||'Class-List'
        if(!sessionStorage.getItem('_Class4ThisMeet')) sessionStorage.setItem('_Class4ThisMeet', ccc)
        document.getElementById('select-class').value = ccc.replace(/ /g,'-')
        document.getElementById('class-delete').style.visibility = (ccc==='Class-List')?'hidden':'visible'
    })
    document.getElementById('class-notes').value=sessionStorage.getItem( 'class-notes' )
    //Has the extension been updated?
    check4Changes()

    loadClassNames()
    
    //now wait until they've entered the Meet
    wait4Meet2Start()

})
*/
;(function() {	
    function waitForElement(elementPath, callBack){
        //console.log("Waiting for: " + elementPath)
        
        let waitfor=elementPath==='[data-call-ended = "true"]'?10000:1000
        //let maxWait=waitfor==1000?10:null
        
        window.setTimeout(function(){
            //console.log('numChecks: '+numChecks)
            let itExists = document.querySelector(elementPath)
            //if( numChecks < maxWait && (!itExists || itExists.length === 0)) {
            if( !itExists || itExists.length === 0 ) {
                //numChecks++
                waitForElement(elementPath, callBack);
            }
            else{
                //numChecks=null
                callBack(elementPath, itExists);
            }
        },waitfor)
    }
    waitForElement("[data-allocation-index]",function(){
        alert("Hola mundito");
        var observer = new MutationObserver(function( mutations ) {
            //esto es constante

        });
        // watch for changes (adding new participants to the Meet)
        observer.observe(document.body, {childList:true, attributes:true, attributeFilter: ['data-self-name','data-participant-id','data-requested-participant-id'], subtree:true, characterData:false});
        waitForElement('[data-participant-id]',function(){
            alert("NuevoParticipante");   
        })
    })
    waitForElement('[data-call-ended="true"]',function(){
        alert("Adios mundito");
    })
})()