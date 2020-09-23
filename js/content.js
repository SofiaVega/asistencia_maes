;(function() {	
    let horaInicio=0;
    let horaFinal=0;
    let totalTime=0;
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

    const meetUIStrings = {
        de:{ presenting:"präsentation", presentation:"blidschirm", you:"ich", joined:"nimmt teil", hide:'(teilnehmer \\w*|\\w* participant)'},
        en:{ presenting:"presenting", presentation:"presentation", you:"you", joined:"(has |)joined", hide:'\\w* participant'},
        es:{ presenting:"presentando", presentation:"presentación", you:"tú", joined:"(se unió|se ha unido)", hide:'\\w* participant(e)?'},
        fr:{ presenting:"présentez", presentation:"présentation", you:"vous", joined:"(participe|s'est joint à l'appel)", hide:'(\\w* le participant|\\w* participant)'},
        it:{ presenting:"presentando", presentation:"presentazione", you:"tu", joined:"(sta partecipando|partecipa)", hide:'\\w* (partecipante|participant)'},
        nl:{ presenting:"presentatie", presentation:"presenteert", you:"jij", joined:"neemt( nu|) deel", hide:'(deelnemer \\w*|\\w* particpant)'},
        pt:{ presenting:"apresentando", presentation:"apresentação", you:"(eu|você)", joined:"(está|participando|aderiu( à chamada|))", hide:'\\w* participant(e)?'},
        zh:{ presenting:"你的演示|你正在向所有人展示|停止展示|展示内容中的音频", presentation:"展示", you:"你", joined:"(已加入|加入了通话)", hide:'\\w* participant(e)?'},
    }
    //language.js
    function getMeetUIStrings(){
        meetUIStrings['es'].more='(\\b\\w)? \\w* \\d+.*'
        meetUIStrings['es'].keep_off='keep_off' //placeholder to exclude spurious keep_off entries
        return meetUIStrings['es']
    }
    

    let uiStrings = getMeetUIStrings()
    // create regexes
    //let re_replace = new RegExp('(\\b)*'+uiStrings.you+'\n|(\\b)*'+uiStrings.joined+'(\\b)*|(\\b)*'+uiStrings.more+'(\\b)*|'+uiStrings.hide, "gi");
    let re_replace = new RegExp('^'+uiStrings.you+'$|\\b'+uiStrings.joined+'(\\b)*|(\\b)*'+uiStrings.more+'(\\b)*|(\\b)*'+uiStrings.keep_off+'(\\b)*|'+uiStrings.hide, "gi");
    //console.log(re_replace)
    let duplicatedLines = /^(.*)(\r?\n\1)+$/gm

    function cleanseInnerHTML(tih){
        if (!tih.querySelector('[data-self-name]')){
            //console.log('no data-self name\n'+tih)
            return ''
        }
        let nm=tih.querySelector('[data-self-name]').innerHTML
        if (!nm){
            return ''
        }

        return nm.replace(/<[^>]*?>/ig,'\n')
            .replace(re_replace,'')
            .replace(/\n\s*\n*/gm,'\n')
            .replace(/(\(|（).*(\)|）)/ig,'')
            .replace(duplicatedLines, "$1")
            .trim()
            .split('\n')[0]
    }
    let lista=[];
    let oldlista=[];
    function checkParticipants(){
        let listaNueva=getListOfParticipants();
        for(let p of listaNueva){
            if(!lista.includes(p)){
                lista.push(p);
                console.log(p);
            }
        }
        /*if(lista===oldlista){
            //do nothing
        }else{
            for(let persona of lista){
                console.log(persona);
                //alert(persona+' has joined the game!');
            }
            oldlista=lista;
        }*/

    }
    function getListOfParticipants(){
        let listaLocal=[];
        let participants = document.querySelectorAll('[data-participant-id],[data-requested-participant-id]');
        
        for(let participant of participants){
            let pName = cleanseInnerHTML(participant);
            if(pName === '')	continue
            let lowercase = pName.toLowerCase().trim()
            if( lowercase.indexOf(uiStrings.presenting) >= 0 || lowercase.indexOf(uiStrings.presentation) >= 0) continue
            let pidr=participant.dataset.participantId||participant.dataset.requestedParticipantId||participant.dataset.initialParticipantId, pid=pidr.split('/')[3]
            if(participant.outerHTML.indexOf('data-is-anonymous')>-1){
                console.log('anonimous');
                continue
            }
            let trimmed=participant.outerHTML.replace(/(class|style|jsaction|jsname|jscontroller|jsshadow|jsmodel)="[^"]*"/gm,'').replace(/<path.*?<\/path>/g,'_path_').replace(/<span.*?<svg.*?<\/svg><\/span>/g,'_svg_').replace(/<img[^>]*?>/g,'_img_').replace(/\s{2,}/g,' ').replace(/\s*>/g,'>')
             
            // if there's no matching entry, add it with arrival time
            /*if(listaLocal.length===0 || listaLocal.find(pName)==undefined){
                console.log('Añadiendo ' + pName + ' a lista');
                listaLocal.push(pName);
            }*/
            listaLocal.push(pName);
            return listaLocal;
            //console.log(pName);
            //alert(pName+' has joined the game!');
        }
    }
    waitForElement("[data-allocation-index]",function(){
        alert("MAE abrio su sesion");
        horaInicio=Date.now();
        var observer = new MutationObserver(function( mutations ) {
            //esto es constante
            checkParticipants();
        });
        // watch for changes (adding new participants to the Meet)
        observer.observe(document.body, {childList:true, attributes:true, attributeFilter: ['data-self-name','data-participant-id','data-requested-participant-id'], subtree:true, characterData:false});
        waitForElement('[data-participant-id]',function(){
            alert("NuevoParticipante");
            console.log('Nuevo participante');
            //checkParticipants();
        })
    })
    
    waitForElement('[data-call-ended="true"]',function(){
        for(nombre of lista){
            alert(nombre);
        }
        horaFinal=Date.now();
        totalTime=(horaFinal-horaInicio)/60000;
        alert("MAE cerro su sesion, "+totalTime+" minutos.");
    })
})()