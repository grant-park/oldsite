!function(){"use strict";var e=!1;if("undefined"!=typeof process&&!process.browser){e=!0;var t=require("request".trim())}var o=!1,n=!1;try{var r=new XMLHttpRequest;"undefined"!=typeof r.withCredentials?o=!0:"XDomainRequest"in window&&(o=!0,n=!0)}catch(e){}var s=Array.prototype.indexOf,i=function(e,t){var o=0,n=e.length;if(s&&e.indexOf===s)return e.indexOf(t);for(;o<n;o++)if(e[o]===t)return o;return-1},a=function(t){return this&&this instanceof a?("string"==typeof t&&(t={key:t}),this.callback=t.callback,this.wanted=t.wanted||[],this.key=t.key,this.simpleSheet=!!t.simpleSheet,this.parseNumbers=!!t.parseNumbers,this.wait=!!t.wait,this.reverse=!!t.reverse,this.postProcess=t.postProcess,this.debug=!!t.debug,this.query=t.query||"",this.orderby=t.orderby,this.endpoint=t.endpoint||"https://spreadsheets.google.com",this.singleton=!!t.singleton,this.simple_url=!!t.simple_url,this.callbackContext=t.callbackContext,this.prettyColumnNames="undefined"==typeof t.prettyColumnNames?!t.proxy:t.prettyColumnNames,"undefined"!=typeof t.proxy&&(this.endpoint=t.proxy.replace(/\/$/,""),this.simple_url=!0,this.singleton=!0,o=!1),this.parameterize=t.parameterize||!1,this.singleton&&("undefined"!=typeof a.singleton&&this.log("WARNING! Tabletop singleton already defined"),a.singleton=this),/key=/.test(this.key)&&(this.log("You passed an old Google Docs url as the key! Attempting to parse."),this.key=this.key.match("key=(.*?)(&|#|$)")[1]),/pubhtml/.test(this.key)&&(this.log("You passed a new Google Spreadsheets url as the key! Attempting to parse."),this.key=this.key.match("d\\/(.*?)\\/pubhtml")[1]),this.key?(this.log("Initializing with key "+this.key),this.models={},this.model_names=[],this.base_json_path="/feeds/worksheets/"+this.key+"/public/basic?alt=",e||o?this.base_json_path+="json":this.base_json_path+="json-in-script",void(this.wait||this.fetch())):void this.log("You need to pass Tabletop a key!")):new a(t)};a.callbacks={},a.init=function(e){return new a(e)},a.sheets=function(){this.log("Times have changed! You'll want to use var tabletop = Tabletop.init(...); tabletop.sheets(...); instead of Tabletop.sheets(...)")},a.prototype={fetch:function(e){"undefined"!=typeof e&&(this.callback=e),this.requestData(this.base_json_path,this.loadSheets)},requestData:function(t,r){if(e)this.serverSideFetch(t,r);else{var s=this.endpoint.split("//").shift()||"http";!o||n&&s!==location.protocol?this.injectScript(t,r):this.xhrFetch(t,r)}},xhrFetch:function(e,t){var o=n?new XDomainRequest:new XMLHttpRequest;o.open("GET",this.endpoint+e);var r=this;o.onload=function(){var e;try{e=JSON.parse(o.responseText)}catch(e){console.error(e)}t.call(r,e)},o.send()},injectScript:function(e,t){var o,n=document.createElement("script");if(this.singleton)t===this.loadSheets?o="Tabletop.singleton.loadSheets":t===this.loadSheet&&(o="Tabletop.singleton.loadSheet");else{var r=this;o="tt"+ +new Date+Math.floor(1e5*Math.random()),a.callbacks[o]=function(){var e=Array.prototype.slice.call(arguments,0);t.apply(r,e),n.parentNode.removeChild(n),delete a.callbacks[o]},o="Tabletop.callbacks."+o}var s=e+"&callback="+o;this.simple_url?e.indexOf("/list/")!==-1?n.src=this.endpoint+"/"+this.key+"-"+e.split("/")[4]:n.src=this.endpoint+"/"+this.key:n.src=this.endpoint+s,this.parameterize&&(n.src=this.parameterize+encodeURIComponent(n.src)),document.getElementsByTagName("script")[0].parentNode.appendChild(n)},serverSideFetch:function(e,o){var n=this;t({url:this.endpoint+e,json:!0},function(e,t,r){return e?console.error(e):void o.call(n,r)})},isWanted:function(e){return 0===this.wanted.length||i(this.wanted,e)!==-1},data:function(){if(0!==this.model_names.length)return this.simpleSheet?(this.model_names.length>1&&this.debug&&this.log("WARNING You have more than one sheet but are using simple sheet mode! Don't blame me when something goes wrong."),this.models[this.model_names[0]].all()):this.models},addWanted:function(e){i(this.wanted,e)===-1&&this.wanted.push(e)},loadSheets:function(t){var n,r,s=[];for(this.googleSheetName=t.feed.title.$t,this.foundSheetNames=[],n=0,r=t.feed.entry.length;n<r;n++)if(this.foundSheetNames.push(t.feed.entry[n].title.$t),this.isWanted(t.feed.entry[n].content.$t)){var i=t.feed.entry[n].link.length-1,a=t.feed.entry[n].link[i].href.split("/").pop(),l="/feeds/list/"+this.key+"/"+a+"/public/values?alt=";l+=e||o?"json":"json-in-script",this.query&&(l+="&sq="+this.query),this.orderby&&(l+="&orderby=column:"+this.orderby.toLowerCase()),this.reverse&&(l+="&reverse=true"),s.push(l)}for(this.sheetsToLoad=s.length,n=0,r=s.length;n<r;n++)this.requestData(s[n],this.loadSheet)},sheets:function(e){return"undefined"==typeof e?this.models:"undefined"==typeof this.models[e]?void 0:this.models[e]},sheetReady:function(e){this.models[e.name]=e,i(this.model_names,e.name)===-1&&this.model_names.push(e.name),this.sheetsToLoad--,0===this.sheetsToLoad&&this.doCallback()},loadSheet:function(e){var t=this;new a.Model({data:e,parseNumbers:this.parseNumbers,postProcess:this.postProcess,tabletop:this,prettyColumnNames:this.prettyColumnNames,onReady:function(){t.sheetReady(this)}})},doCallback:function(){0===this.sheetsToLoad&&this.callback.apply(this.callbackContext||this,[this.data(),this])},log:function(e){this.debug&&"undefined"!=typeof console&&"undefined"!=typeof console.log&&Function.prototype.apply.apply(console.log,[console,arguments])}},a.Model=function(e){var t,o,n,r;if(this.column_names=[],this.name=e.data.feed.title.$t,this.tabletop=e.tabletop,this.elements=[],this.onReady=e.onReady,this.raw=e.data,"undefined"==typeof e.data.feed.entry)return e.tabletop.log("Missing data for "+this.name+", make sure you didn't forget column headers"),this.original_columns=[],this.elements=[],void this.onReady.call(this);for(var s in e.data.feed.entry[0])/^gsx/.test(s)&&this.column_names.push(s.replace("gsx$",""));for(this.original_columns=this.column_names,t=0,n=e.data.feed.entry.length;t<n;t++){var i=e.data.feed.entry[t],a={};for(o=0,r=this.column_names.length;o<r;o++){var l=i["gsx$"+this.column_names[o]];"undefined"!=typeof l?e.parseNumbers&&""!==l.$t&&!isNaN(l.$t)?a[this.column_names[o]]=+l.$t:a[this.column_names[o]]=l.$t:a[this.column_names[o]]=""}void 0===a.rowNumber&&(a.rowNumber=t+1),e.postProcess&&e.postProcess(a),this.elements.push(a)}e.prettyColumnNames?this.fetchPrettyColumns():this.onReady.call(this)},a.Model.prototype={all:function(){return this.elements},fetchPrettyColumns:function(){if(!this.raw.feed.link[3])return this.ready();var e=this.raw.feed.link[3].href.replace("/feeds/list/","/feeds/cells/").replace("https://spreadsheets.google.com",""),t=this;this.tabletop.requestData(e,function(e){t.loadPrettyColumns(e)})},ready:function(){this.onReady.call(this)},loadPrettyColumns:function(e){for(var t={},o=this.column_names,n=0,r=o.length;n<r;n++)"undefined"!=typeof e.feed.entry[n].content.$t?t[o[n]]=e.feed.entry[n].content.$t:t[o[n]]=o[n];this.pretty_columns=t,this.prettifyElements(),this.ready()},prettifyElements:function(){var e,t,o,n,r=[],s=[];for(t=0,n=this.column_names.length;t<n;t++)s.push(this.pretty_columns[this.column_names[t]]);for(e=0,o=this.elements.length;e<o;e++){var i={};for(t=0,n=this.column_names.length;t<n;t++){var a=this.pretty_columns[this.column_names[t]];i[a]=this.elements[e][this.column_names[t]]}r.push(i)}this.elements=r,this.column_names=s},toArray:function(){var e,t,o,n,r=[];for(e=0,o=this.elements.length;e<o;e++){var s=[];for(t=0,n=this.column_names.length;t<n;t++)s.push(this.elements[e][this.column_names[t]]);r.push(s)}return r}},"undefined"!=typeof module&&module.exports?module.exports=a:"function"==typeof define&&define.amd?define(function(){return a}):window.Tabletop=a}(),function(){"use strict";angular.module("times.tabletop",[]).provider("Tabletop",function(){var e,t={callback:function(t,o){e.resolve([t,o])}};this.setTabletopOptions=function(e){t=angular.extend(t,e)},this.$get=["$q","$window",function(o,n){return e=o.defer(),n.Tabletop.init(t),e.promise}]})}(),function(){"use strict";angular.module("Site",["ngAnimate","times.tabletop","ngSanitize","luegg.directives"]).config(["TabletopProvider",function(e){e.setTabletopOptions({key:"1uvHeB66RrTJ87hmna5SnSvBeiuCQ3PE84OLcTL6iwdI",simple_url:!0})}]).factory("RandomName",[function(){function e(e){return e=e||Math.random,r[Math.floor(e()*r.length)]}function t(e){return e=e||Math.random,n[Math.floor(e()*n.length)]}function o(o){var n=e(o),r=e(o);n=n.substr(0,1).toUpperCase()+n.substr(1),r=r.substr(0,1).toUpperCase()+r.substr(1);var s=t(o);return s+n+r}var n=["Black","White","Gray","Brown","Red","Pink","Crimson","Carnelian","Orange","Yellow","Ivory","Cream","Green","Viridian","Aquamarine","Cyan","Blue","Cerulean","Azure","Indigo","Navy","Violet","Purple","Lavender","Magenta","Rainbow","Iridescent","Spectrum","Prism","Bold","Vivid","Pale","Clear","Glass","Translucent","Misty","Dark","Light","Gold","Silver","Copper","Bronze","Steel","Iron","Brass","Mercury","Zinc","Chrome","Platinum","Titanium","Nickel","Lead","Pewter","Rust","Metal","Stone","Quartz","Granite","Marble","Alabaster","Agate","Jasper","Pebble","Pyrite","Crystal","Geode","Obsidian","Mica","Flint","Sand","Gravel","Boulder","Basalt","Ruby","Beryl","Scarlet","Citrine","Sulpher","Topaz","Amber","Emerald","Malachite","Jade","Abalone","Lapis","Sapphire","Diamond","Peridot","Gem","Jewel","Bevel","Coral","Jet","Ebony","Wood","Tree","Cherry","Maple","Cedar","Branch","Bramble","Rowan","Ash","Fir","Pine","Cactus","Alder","Grove","Forest","Jungle","Palm","Bush","Mulberry","Juniper","Vine","Ivy","Rose","Lily","Tulip","Daffodil","Honeysuckle","Fuschia","Hazel","Walnut","Almond","Lime","Lemon","Apple","Blossom","Bloom","Crocus","Rose","Buttercup","Dandelion","Iris","Carnation","Fern","Root","Branch","Leaf","Seed","Flower","Petal","Pollen","Orchid","Mangrove","Cypress","Sequoia","Sage","Heather","Snapdragon","Daisy","Mountain","Hill","Alpine","Chestnut","Valley","Glacier","Forest","Grove","Glen","Tree","Thorn","Stump","Desert","Canyon","Dune","Oasis","Mirage","Well","Spring","Meadow","Field","Prairie","Grass","Tundra","Island","Shore","Sand","Shell","Surf","Wave","Foam","Tide","Lake","River","Brook","Stream","Pool","Pond","Sun","Sprinkle","Shade","Shadow","Rain","Cloud","Storm","Hail","Snow","Sleet","Thunder","Lightning","Wind","Hurricane","Typhoon","Dawn","Sunrise","Morning","Noon","Twilight","Evening","Sunset","Midnight","Night","Sky","Star","Stellar","Comet","Nebula","Quasar","Solar","Lunar","Planet","Meteor","Sprout","Pear","Plum","Kiwi","Berry","Apricot","Peach","Mango","Pineapple","Coconut","Olive","Ginger","Root","Plain","Fancy","Stripe","Spot","Speckle","Spangle","Ring","Band","Blaze","Paint","Pinto","Shade","Tabby","Brindle","Patch","Calico","Checker","Dot","Pattern","Glitter","Glimmer","Shimmer","Dull","Dust","Dirt","Glaze","Scratch","Quick","Swift","Fast","Slow","Clever","Fire","Flicker","Flash","Spark","Ember","Coal","Flame","Chocolate","Vanilla","Sugar","Spice","Cake","Pie","Cookie","Candy","Caramel","Spiral","Round","Jelly","Square","Narrow","Long","Short","Small","Tiny","Big","Giant","Great","Atom","Peppermint","Mint","Butter","Fringe","Rag","Quilt","Truth","Lie","Holy","Curse","Noble","Sly","Brave","Shy","Lava","Foul","Leather","Fantasy","Keen","Luminous","Feather","Sticky","Gossamer","Cotton","Rattle","Silk","Satin","Cord","Denim","Flannel","Plaid","Wool","Linen","Silent","Flax","Weak","Valiant","Fierce","Gentle","Rhinestone","Splash","North","South","East","West","Summer","Winter","Autumn","Spring","Season","Equinox","Solstice","Paper","Motley","Torch","Ballistic","Rampant","Shag","Freckle","Wild","Free","Chain","Sheer","Crazy","Mad","Candle","Ribbon","Lace","Notch","Wax","Shine","Shallow","Deep","Bubble","Harvest","Fluff","Venom","Boom","Slash","Rune","Cold","Quill","Love","Hate","Garnet","Zircon","Power","Bone","Void","Horn","Glory","Cyber","Nova","Hot","Helix","Cosmic","Quark","Quiver","Holly","Clover","Polar","Regal","Ripple","Ebony","Wheat","Phantom","Dew","Chisel","Crack","Chatter","Laser","Foil","Tin","Clever","Treasure","Maze","Twisty","Curly","Fortune","Fate","Destiny","Cute","Slime","Ink","Disco","Plume","Time","Psychadelic","Relic","Fossil","Water","Savage","Ancient","Rapid","Road","Trail","Stitch","Button","Bow","Nimble","Zest","Sour","Bitter","Phase","Fan","Frill","Plump","Pickle","Mud","Puddle","Pond","River","Spring","Stream","Battle","Arrow","Plume","Roan","Pitch","Tar","Cat","Dog","Horse","Lizard","Bird","Fish","Saber","Scythe","Sharp","Soft","Razor","Neon","Dandy","Weed","Swamp","Marsh","Bog","Peat","Moor","Muck","Mire","Grave","Fair","Just","Brick","Puzzle","Skitter","Prong","Fork","Dent","Dour","Warp","Luck","Coffee","Split","Chip","Hollow","Heavy","Legend","Hickory","Mesquite","Nettle","Rogue","Charm","Prickle","Bead","Sponge","Whip","Bald","Frost","Fog","Oil","Veil","Cliff","Volcano","Rift","Maze","Proud","Dew","Mirror","Shard","Salt","Pepper","Honey","Thread","Bristle","Ripple","Glow","Zenith"],r=["head","crest","crown","tooth","fang","horn","frill","skull","bone","tongue","throat","voice","nose","snout","chin","eye","sight","seer","speaker","singer","song","chanter","howler","chatter","shrieker","shriek","jaw","bite","biter","neck","shoulder","fin","wing","arm","lifter","grasp","grabber","hand","paw","foot","finger","toe","thumb","talon","palm","touch","racer","runner","hoof","fly","flier","swoop","roar","hiss","hisser","snarl","dive","diver","rib","chest","back","ridge","leg","legs","tail","beak","walker","lasher","swisher","carver","kicker","roarer","crusher","spike","shaker","charger","hunter","weaver","crafter","binder","scribe","muse","snap","snapper","slayer","stalker","track","tracker","scar","scarer","fright","killer","death","doom","healer","saver","friend","foe","guardian","thunder","lightning","cloud","storm","forger","scale","hair","braid","nape","belly","thief","stealer","reaper","giver","taker","dancer","player","gambler","twister","turner","painter","dart","drifter","sting","stinger","venom","spur","ripper","swallow","devourer","knight","lady","lord","queen","king","master","mistress","prince","princess","duke","dutchess","samurai","ninja","knave","slave","servant","sage","wizard","witch","warlock","warrior","jester","paladin","bard","trader","sword","shield","knife","dagger","arrow","bow","fighter","bane","follower","leader","scourge","watcher","cat","panther","tiger","cougar","puma","jaguar","ocelot","lynx","lion","leopard","ferret","weasel","wolverine","bear","raccoon","dog","wolf","kitten","puppy","cub","fox","hound","terrier","coyote","hyena","jackal","pig","horse","donkey","stallion","mare","zebra","antelope","gazelle","deer","buffalo","bison","boar","elk","whale","dolphin","shark","fish","minnow","salmon","ray","fisher","otter","gull","duck","goose","crow","raven","bird","eagle","raptor","hawk","falcon","moose","heron","owl","stork","crane","sparrow","robin","parrot","cockatoo","carp","lizard","gecko","iguana","snake","python","viper","boa","condor","vulture","spider","fly","scorpion","heron","oriole","toucan","bee","wasp","hornet","rabbit","bunny","hare","brow","mustang","ox","piper","soarer","flasher","moth","mask","hide","hero","antler","chill","chiller","gem","ogre","myth","elf","fairy","pixie","dragon","griffin","unicorn","pegasus","sprite","fancier","chopper","slicer","skinner","butterfly","legend","wanderer","rover","raver","loon","lancer","glass","glazer","flame","crystal","lantern","lighter","cloak","bell","ringer","keeper","centaur","bolt","catcher","whimsey","quester","rat","mouse","serpent","wyrm","gargoyle","thorn","whip","rider","spirit","sentry","bat","beetle","burn","cowl","stone","gem","collar","mark","grin","scowl","spear","razor","edge","seeker","jay","ape","monkey","gorilla","koala","kangaroo","yak","sloth","ant","roach","weed","seed","eater","razor","shirt","face","goat","mind","shift","rider","face","mole","vole","pirate","llama","stag","bug","cap","boot","drop","hugger","sargent","snagglefoot","carpet","curtain"];return o()}]).factory("DialoguePortfolioParser",[function(){var e={parse:function(e){var t={};return t.dialogue=[],_.each(e[0].Dialogue.elements,function(e){t.dialogue.push({possibleInputs:e.possibleInputs.split(","),response:e.response})}),t.portfolio=e[0].Portfolio.elements,t}};return e}]).factory("DialogueCache",[function(){return{dialogue:[{response:"Hello &#128522;",possibleInputs:["hello","greetings","hi","hey","wassup","whats up","ayy","hola","ni hao","hoy","eyy"]},{response:"I was born in Chattanooga, TN and raised in Huntsville, AL.",possibleInputs:["where are you from","you from","born"]},{response:"Yup",possibleInputs:["okay","oh"]},{response:"Why, thank-you &#128522;",possibleInputs:["you're","youre","you are"]},{response:"My favorite movie is <i>The Imitation Game</i>.",possibleInputs:["movie"]},{response:"My favorite novel is <i>The Brothers Karamazov</i> by Fyodor Dostoevsky.",possibleInputs:["book"]},{response:"Nikola Tesla",possibleInputs:["person in history","historical person","favorite person"]},{response:"Bay Area",possibleInputs:["place"]},{response:"Tonkatsu",possibleInputs:["food"]},{response:"Dog",possibleInputs:["animal"]},{response:"Teal",possibleInputs:["color","colour"]},{response:"I&#39;d like to someday work full-time at either a start-up or a large company as a software engineer.",possibleInputs:["want to do","plan","future","would you like to do","what do you want"]},{response:"I like jazz, hip-hop, and classical music.",possibleInputs:["music","listen","genre","what do you like","what kind of stuff do you like"]},{response:"I play the piano and violin.",possibleInputs:["instruments","play"]},{response:"I&#39;m currently majoring in computer science and music at Amherst College.",possibleInputs:["study","major","subject","degree","bachelor","college","school"]},{response:"20",possibleInputs:[" age","old"]},{response:"Grant Park",possibleInputs:["name"]},{response:"I currently live in Amherst, MA.",possibleInputs:["where","live"]},{response:"Sorry to hear that. &#128533;",possibleInputs:["not","bad","terrible"]},{response:"Sweet. &#128522;",possibleInputs:["good","fine","well","awesome","fantastic","amazing","same","me too","as well"]},{response:"I&#39;m doing pretty well, thanks! How about you?",possibleInputs:["how are you","how are you doing","how are you feeling"]},{response:"I think everyday is a nice day...",possibleInputs:["weather","cold","climate","temp","hot","warm","chill"]},{response:"&#128522;",possibleInputs:["lol","rofl","wow","woah","dang","huh","eh","hm","jeez","geez","cool"]},{response:'Tap this phone&#39;s home button or enter <span style="color:lemonchiffon">&#39;switch&#39;</span> to transition to my projects.',possibleInputs:["project","example","done"]},{response:'You can email me at <a href="mailto:gpark18@amherst.edu">gpark18@amherst.edu</a>. &#128522;',possibleInputs:["contact","email","reach"]},{response:"I&#39;m a sophomore at Amherst College and I freelance iOS. I&#39;m also a full-stack dev working with MEAN, Python, and Swift/Obj-C.",possibleInputs:["about","you do","job","occupation","now","language","work","who are you","who"]},{response:'I&#39;m an <a href="https://soundcloud.com/grant-park">indie artist</a>, rowing athlete, and <a href="https://www.behance.net/grantpark">designer</a>. Check out my <a href="https://medium.com/@grantxs">blog</a> &#128513;',possibleInputs:["do you like to do","hob","design","extracurricular","outside","fun"]},{response:'Here is my <a href="https://www.linkedin.com/in/granthpark">LinkedIn</a>.',possibleInputs:["linkedin"]},{response:'Here is my <a href="https://github.com/sungjp">Github</a>.',possibleInputs:["git"]},{response:'Here is my <a href="parkgrantresume.pdf" target="_blank">resume</a>.',possibleInputs:["resume"]},{response:'Here is my <a href="parkgrantresume.pdf">resume</a>, <a href="https://github.com/sungjp">Github</a>, and <a href="https://www.linkedin.com/in/granthpark">LinkedIn</a>.',possibleInputs:["links"]},{response:"Hello &#128522;",possibleInputs:["yo","oi"]},{response:'Try including: <span style="color:lemonchiffon"> <br/> &#39;links&#39; <br/> &#39;projects&#39; <br/> &#39;hobbies&#39; <br/> &#39;contact&#39; <br/> &#39;about&#39; </span> ',possibleInputs:["?","help"]}],portfolio:[{name:"Hurdlr",icon:"hurdlr",link:"https://hurdlr.com/"},{name:"Dangle",icon:"dangle",link:"https://itunes.apple.com/us/app/dangle-parents-kids-connect/id1082572052?mt=8"},{name:"Hungrie",icon:"hungrie",link:"http://www.hungrie.site/"},{name:"Byte",icon:"byte",link:"http://yhackbyte.herokuapp.com/"},{name:"Amherst EC",icon:"amherstec",link:"http://amherstec.github.io/"},{name:"NoteSMS",icon:"notesms",link:"http://www.grant.ai/BostonHacks/index.html"},{name:"OutsideHacks",icon:"outsidehacks",link:"http://www.grant.ai/outside.html"},{name:"CodePen",icon:"codepen",link:"http://codepen.io/sungjp/"},{name:"LinkedIn",icon:"linkedin",link:"https://www.linkedin.com/in/granthpark"},{name:"Github",icon:"github",link:"https://github.com/sungjp"},{name:"Resume",icon:"resume",link:"http://www.grant.ai/parkgrantresume.pdf"},{name:"Website 1.0",icon:"website1",link:"http://www.grantpark.rocks/"}]}}]).factory("GrantsAge",[function(){var e=new Date,t=e.getMonth()+1,o=e.getFullYear(),n=e.getDay(),r=o-1995;return 12>t?r-=1:2>n&&(r-=1),r.toString()}]).factory("GetLocation",["$http","$q",function(e,t){var o,n=t.defer(),r=e({method:"JSONP",url:"https://geoip-db.com/json/geoip.php?jsonp=JSON_CALLBACK"}).success(function(e){o=e.city+", "+e.state+", "+e.country_name}).error(function(e){o="unknown"}),s=function(){n.resolve(o)};return o?s():r.then(function(){s()}),n.promise}]).factory("Weather",["$http","$q",function(e,t){var o,n=t.defer(),r=e.get("").then(function(e){var t=e.data,n=t.location.city,r=t.current_observation.temp_f;o="The current temperature in "+n+" is: "+r+"&degF &#128513;",50>r&&(o="Brrr! The current temperature in "+n+" is: "+r+"&deg:F &#128559;")},function(e){console.error(e),o="I don't have a clue actually..."}),s=function(){n.resolve(o)};return o?s():r.then(function(){s()}),n.promise}]).controller("Dialogue",["$sce","$element","$timeout","$q","$scope","Tabletop","DialoguePortfolioParser","DialogueCache","Weather","GetLocation","GrantsAge","RandomName",function(e,t,o,n,r,s,i,a,l,u,p,h){var c=a,d=a.dialogue,m=(a.portfolio,function(e){for(var t=n.defer(),o=0;o<d.length;o++)for(var r=0;r<d[o].possibleInputs.length;r++)if(e.toLowerCase().indexOf(d[o].possibleInputs[r].toLowerCase())!==-1)return t.resolve({response:d[o].response,i:o,j:r}),t.promise;return t.reject("Sorry, I can't respond to that."),t.promise}),g=20;r.notifCount=0,r.pages=[];var f=[];_.each(r.portfolio,function(e){f.length===g&&(r.pages.push(f),f=[]),f.push(e)}),f!==[]&&r.pages.push(f),r.tabs=[{name:"Github",icon:"prod/img/github.jpg",link:"https://github.com/sungjp"},{name:"LinkedIn",icon:"prod/img/linked.jpg",link:"https://www.linkedin.com/in/granthpark"},{name:"Resume",icon:"prod/img/resume.jpg",link:"http://www.grant.ai/parkgrantresume.pdf"}],r.lock=!1;var y=function(e,t,n){t||r.lock?r.lock||r.messageQueue.push({sender:t?t:"Grant",message:e}):(r.lock=!0,o(function(){r.messageQueue.push({sender:t?t:"Grant",message:e,status:n})},900).then(function(){r.lock=!1}))};r.trustAsHtml=function(t){return e.trustAsHtml(t)},r.dialogue=!0,r.buttonClicked=function(){r.dialogue&&(r.notifCount=0),r.dialogue=!r.dialogue},r.updateNotif=!1;var b=function(e){function t(t){return e.toLowerCase().indexOf(t)!==-1}return t("project")?o(function(){r.dottedAnimate=!0},500):t("switch")&&r.buttonClicked(),!1};r.currentUser={text:""},r.messageQueue=[],r.send=function(e){!r.lock&&e&&(b(e)||(y(e,"user"),t.find("input").val(""),r.currentUser.text=null,k.emit("new message",e),r.amSelected||m(e).then(function(e){switch(e.response){case"E.AGE":y(p);break;case"E.WEATHER":l.then(function(e){y(e)});break;default:y(e.response)}},function(e){y(e)})))},s.then(function(e){var t=n.defer();return e?t.resolve(e):t.reject("Could not retrieve data"),t.promise}).then(function(e){c=i.parse(e),d=c.dialogue,r.portfolio=c.portfolio,r.pages=[];var t=[];_.each(r.portfolio,function(e){t.length===g&&(r.pages.push(t),t=[]),t.push(e)}),t!==[]&&r.pages.push(t)},function(e){console.error(e)}),y("Hi, I'm Grant Park. Ask me anything you'd like. For suggestions, try '?'"),o(function(){t.addClass("loaded")},1250),r.pageMove="translateX(0)",r.currentOption=0,r.optionSelected=function(e){r.pageMove="translateX("+e*-309+"px)",r.currentOption=e},r.imageDict={hurdlr:"prod/img/hurdlr.jpeg",dangle:"prod/img/dangle.jpg",hungrie:"prod/img/hungrie.jpg",byte:"prod/img/byte.jpg",notesms:"prod/img/onenote.jpg",outsidehacks:"prod/img/outside.jpg",amherstec:"prod/img/electronics.jpg",codepen:"prod/img/codepen.jpg",linkedin:"prod/img/linked.jpg",github:"prod/img/github.jpg",resume:"prod/img/resume.jpg",website1:"prod/img/web1.jpg",setmine:"prod/img/setmine.jpg",r2r:"prod/img/r2r.jpg",soundcloud:"prod/img/soundcloud.jpg",medium:"prod/img/medium.jpg",behance:"prod/img/behance.jpg",pair:"prod/img/code.jpg",code:"prod/img/programming.jpg",talks:"prod/img/talks.jpg",dribbble:"prod/img/dribbble-icon.jpg",eye:"prod/img/eye.jpg",calendar:"prod/img/calendar.png",keyboard:"prod/img/kb.jpg",secret:"prod/img/spreadsheets.png"};var k=io.connect("https://grantbot.herokuapp.com/");u.then(function(e){k.emit("new user",h+" ("+e+")")}),window.socket=k,r.amSelected=!1,k.on("I choose you!",function(){r.amSelected=!0,y("Grant has connected.",void 0,{ping:!0,offline:!1}),r.updateNotif=!0,r.notifCount+=1,o(function(){r.updateNotif=!1},1e3)}),k.on("master message",function(e){y(e),r.notifCount+=1,r.updateNotif=!0,o(function(){r.updateNotif=!1},1e3)}),k.on("bye",function(){r.amSelected=!1,y("Grant has disconnected.",void 0,{ping:!0,offline:!0})}),k.on("masterOnline",function(){r.masterOnline=!0})}])}();