var mongo = require('mongodb')
    ,BSON = mongo.BSONPure

var ObjectId = function(id) {
	return new BSON.ObjectID(id)
}

var ISODate = function(dt) {
	return new Date(dt)
}

var NumberInt = function(x) {
	return parseInt(x)
}


exports.dump = function(db) {
/** admin_templates indexes **/
db.collection("admin_templates").ensureIndex({
  "_id": 1
},[
  
],function(){});

/** admin_users indexes **/
db.collection("admin_users").ensureIndex({
  "_id": 1
},[
  
],function(){});

/** groups indexes **/
db.collection("groups").ensureIndex({
  "_id": 1
},[
  
],function(){});

/** groups indexes **/
db.collection("groups").ensureIndex({
  "name": 1
},[
  
],function(){});

/** logs indexes **/
db.collection("logs").ensureIndex({
  "_id": 1
},[
  
],function(){});

/** logs indexes **/
db.collection("logs").ensureIndex({
  "date": 1
},[
  
],function(){});

/** logs indexes **/
db.collection("logs").ensureIndex({
  "model": 1
},[
  
],function(){});

/** logs indexes **/
db.collection("logs").ensureIndex({
  "actionType": 1
},[
  
],function(){});

/** logs indexes **/
db.collection("logs").ensureIndex({
  "user": 1
},[
  
],function(){});

/** mainmenu indexes **/
db.collection("mainmenu").ensureIndex({
  "_id": 1
},[
  
],function(){});

/** news indexes **/
db.collection("news").ensureIndex({
  "_id": 1
},[
  
],function(){});

/** news indexes **/
db.collection("news").ensureIndex({
  "title": 1
},[
  
],function(){});

/** news indexes **/
db.collection("news").ensureIndex({
  "datepubl": 1
},[
  
],function(){});

/** news indexes **/
db.collection("news").ensureIndex({
  "dateunpubl": 1
},[
  
],function(){});

/** news indexes **/
db.collection("news").ensureIndex({
  "ontop": 1
},[
  
],function(){});

/** news indexes **/
db.collection("news").ensureIndex({
  "descript": 1
},[
  
],function(){});

/** pages indexes **/
db.collection("pages").ensureIndex({
  "_id": 1
},[
  
],function(){});

/** admin_templates records **/
db.collection("admin_templates").insert({
  "_id": ObjectId("52482c05e3f8c2c40a000004"),
  "blocks": 1,
  "controller": "public.navigation:global",
  "mtime": ISODate("2013-10-02T16:44:26.143Z"),
  "name": "Homepage",
  "tpl": "index.tpl"
},function(){});
db.collection("admin_templates").insert({
  "mtime": ISODate("2013-10-02T16:44:58.822Z"),
  "name": "Inner",
  "blocks": 1,
  "tpl": "inner.tpl",
  "controller": "public.navigation:global",
  "_id": ObjectId("524c4d8a7fc7804269000002")
},function(){});

/** admin_users records **/
db.collection("admin_users").insert({
  "_id": ObjectId("52474ba2ec861f270a000001"),
  "login": "yeti",
  "pass": "3d4f2bf07dc1be38b20cd6e46949a1071f9d0e3d",
  "sets": {
    "desktop": {
      "wallPaper": "wallpapers\/desktop.jpg",
      "stretch": false
    },
    "groups-win": {
      "formPin": false
    },
    "pages-win": {
      "maximize": false
    },
    "mainmenu-win": {
      "maximize": false
    },
    "news-win": {
      "maximize": false
    }
  },
  "superuser": true
},function(){});

/** groups records **/
db.collection("groups").insert({
  "_id": ObjectId("524825d5e3f8c2c40a000001"),
  "description": "",
  "modelAccess": {
    "filemanager-fm": {
      "read": true,
      "add": true,
      "modify": true,
      "del": true
    },
    "logs-LogsModel": {
      "read": true,
      "add": true,
      "modify": true,
      "del": true
    },
    "mainmenu-MainModel": {
      "read": true,
      "add": true,
      "modify": true,
      "del": true
    },
    "pages-PagesModel": {
      "read": true,
      "add": true,
      "modify": true,
      "del": true
    },
    "profile-ProfileModel": {
      "read": true,
      "add": true,
      "modify": true,
      "del": true
    },
    "templates-TemplatesModel": {
      "read": true,
      "add": true,
      "modify": true,
      "del": true
    },
    "users-GroupsModel": {
      "read": true,
      "add": true,
      "modify": true,
      "del": true
    },
    "users-PublUsersModel": {
      "read": true,
      "add": true,
      "modify": true,
      "del": true
    },
    "users-UsersModel": {
      "read": true,
      "add": true,
      "modify": true,
      "del": true
    }
  },
  "mtime": ISODate("2013-09-29T13:06:41.348Z"),
  "name": "Администраторы",
  "pagesAccess": [
    
  ]
},function(){});

/** logs records **/
db.collection("logs").insert({
  "date": ISODate("2013-10-03T16:04:10.661Z"),
  "user": "yeti",
  "model": "MyDesktop.modules.news.model.NewsModel",
  "actionType": "update",
  "saved": {
    "_id": ObjectId("524d91a132482b7b6e000001"),
    "datepubl": ISODate("2013-10-02T20:00:00.0Z"),
    "dateunpubl": ISODate("1970-01-01T00:00:00.0Z"),
    "descript": "<p>We love the flash. And the occasional winning night at the tables.<br \/>But there's a slower side to this city of just less than 600,000 residents, one of cobblestone lanes, colonial mansions, art deco buildings and tranquil parks, all done in a fusion of Chinese and Portuguese motifs.<br \/>The best part is that Macau (just an hour from Hong Kong by ferry) is compact, making it a breeze to explore.<br \/>Here's a primer.<br \/>1. Baccarat is the game of choice<br \/>Macau is the gambling capital of the world.<br \/>By far the most popular game is baccarat, a relatively simple game with a low house advantage (less than 1%).<br \/>Baccarat tables dominate the city's 33 casinos.<br \/>There are plenty of slot machines as well, but they offer a high house advantage and aren't popular. This is the reverse of Las Vegas where gamblers favor slots.<br \/>Macau's revenue from gambling is $33 billion, more than five times that of the Las Vegas Strip.<br \/>Tycoon Stanley Ho's 40-year reign as the city's casino kingpin came to an end in 2002 when the Macau government ended the monopoly system.<br \/>Today, there are six casino operators: SJM Holdings (Stanley Ho), Wynn Macau, Sands China, Galaxy Entertainment Group, MGM China Holdings and Melco Crown Entertainment.<br \/>After 443 years of Portuguese rules, Macau offers an authentic European experience.<br \/>After 443 years of Portuguese rules, Macau offers an authentic European experience.<br \/>2. Macau was the first and last European colony in China<br \/>The Portuguese settled in Macau in the 16th century and the island was handed back to China in 1999.<br \/>Today, Macau is a Special Administrative Region (SAR) -- as is Hong Kong -- and is governed under the \"one country, two systems\" principal, which was the brainchild of late paramount leader Deng Xiaoping.<br \/>Although no longer a colony, Portuguese is still an official language and the Portuguese influence can be seen everywhere from blue tiled street signs to tiled floors and beautiful gardens.<br \/>More: Top-notch hotel under $100: Macau's best boutique stay<br \/>3. It's the world's most densely populated place<br \/>Macau has the world's highest population density with 20,497 people per square kilometer.<br \/>No surprise then that it needed to do something dramatic to make room for new casinos and 30 million visitors that come every year.<br \/>The solution was a massive land reclamation project that joined the two islands south of the mainland -- Coloane and Taipa. This gave Macau an extra 5.2 square kilometers to create a gambling mecca to rival Las Vegas.<br \/>It's known as the Cotai Strip -- drawing on the names of the two islands, Coloane and Taipa.<br \/>The Venetian Resort, City of Dreams, Sands Cotai and Galaxy Macau Resort are all on the Cotai Strip.<br \/>There's another big one on the way -- Steve Wynn is spending $4 billion on a huge resort called Wynn Palace set to open in 2016.<br \/>4. Coloane is still chill<br \/>The most southern island, Coloane, remains wonderfully untouched by the casino craziness.<br \/>This is largely due to strict rules over title deeds that make it difficult to buy property on the island.<br \/>The low-rise houses and quiet tree-lined streets that give Coloane its charm remain as they have for decades.<br \/>Coloane is home to Lord Stow's Bakery, birthplace of Macau's much-loved egg tart. Not too sweet, these tarts with their crispy pastry are worth queuing for.<br \/>Another Coloane favourite is Fernando's. Like the rest of Coloane, it's super laid-back and the food is reliably good. The garlic prawns and suckling pig are must orders.<br \/>More: Insider Guide: Best of Macau<br \/>Preservation is a result of foresight.<br \/>Preservation is a result of foresight.<br \/>5. Heritage is here to stay<br \/>Before the big casino operators rolled into town the Macau government did something clever -- it applied to UNESCO for World Heritage status.<br \/>In 2005, the historic center of Macau was put on the list.<br \/>The city's historic monuments are one of the city's biggest draws, a wonderful example of the early encounter between Chinese and European civilizations.<br \/>The old heart of the city is small and a walking tour can easily take in the key sites from the iconic Senado Square, the Ruins of St. Pauls, the beautiful churches and temples and the old city wall.<br \/>Most of the sites are open daily and free to visit.<br \/>Lots of influences went into that chunk of cod.<br \/>Lots of influences went into that chunk of cod.<br \/>6. Macanese cuisine is fusion food<br \/>Macanese cuisine is unique to Macau and combines the best of Chinese and Portuguese ingredients and cooking along with influences from Brazil, Goa and other former Portuguese colonies.<br \/>There's plenty of seafood -- codfish, sardines, crab -- as well as rabbit, duck and chicken.<br \/>Portuguese influence is seen in the flavoring, with plenty of turmeric, cinnamon, chili and coconut. Dishes are often baked or roasted for a long time to allow the flavors and spices to develop.<br \/>Macau's caldo verde soup is a popular starter and is similar to the Portuguese original, but uses bok choy instead of collard greens.<br \/>The national dish is minchi -- minced beef or pork cooked with potatoes, onions, soy sauce and sometimes an egg.<br \/>7. Broken Tooth is out and about<br \/>He was once Asia's most feared gangster, the leader of the 14K triads, and after 13 years behind bars he's now a free man.<br \/>Wan Kuok-koi was born in Macau's slums and worked his way up triads.<br \/>Along the way he broke several teeth in street fights and earned his nickname.<br \/>As head of the largest triad society in Macau, he and his crew waged a violent turf war against a rival gang, the Shui Fong, in the years running up to the 1999 handover. It was a time of drive-by shootings and car bombs that came to an end only when he was jailed in 1999.<br \/>Broken Tooth must have had a shock when he was released in December last year. Macau changed dramatically while he was in prison and the swathe of new monster casinos has totally transformed the city.<br \/>Today, the triads have almost total control of the junket operators and keep a low profile.<br \/>8. It's a city of longevity<br \/>People in Macau live a long time -- an average of 84.4 years.<br \/>Macau takes second place in global life expectancy.<br \/>Only the residents of Monaco -- ironically another place beginning with the letter \"M\" that's known for its casinos -- live longer (89.6 years).<br \/>The fantastic economy is thought to have a lot to do with the great life expectancy. This year Macau was named the world's second fastest growing economy (after Mongolia) and more than 50% of Macau's revenue comes from gambling.<br \/>So while the chain-smoking high rollers might be knocking off years with stressful, risky gambles, the locals are almost guaranteed their golden years.<br \/>More: 40 Hong Kong dishes we can't live without<br \/>\\<br \/>\"Dad, I told you stop visiting me at work.\"<br \/>9. One in five locals work in a casino<br \/>Macau's casinos employ 20% of the population.<br \/>When a casino takes on new staff, it checks to see if he or she has family working in the casino and in which section, to avoid the possibility of fraud.<br \/>Locals rarely visit the casinos to gamble and government employees are forbidden from gambling here. The overwhelming majority of gamblers are from mainland China and Hong Kong.<br \/>New regulations brought in early this year means that 50% of a casino floor must be non-smoking. The massive open plan Venetian Macau -- the largest casino floor in the world -- uses a smart ventilation system that creates areas of low and high pressure to ensure that the smoke is drawn up into air vents.<br \/>10. The beach has black sand<br \/>Hac Sa Beach -- which translates as \"Black Sand Bay\" -- is Macau's largest natural beach.<br \/>It's on the southeast side of Coloane Island.<br \/>The beach is a kilometer long and famous for its black sand. It gets its unique color from minerals in the seabed that are washed ashore.<br \/>The sand isn't as black as it used to be. Erosion was gradually chipping away at the beach so the government decided to top up the beach, but the replacement sand is yellow, which has muted the dark sand.<br \/>More: World's 100 best beaches<\/p>",
    "mtime": ISODate("2013-10-03T15:48:37.780Z"),
    "ontop": false,
    "photos": [
      {
        "img": "<Mongo Binary Data>",
        "preview": "<Mongo Binary Data>"
      },
      {
        "img": "<Mongo Binary Data>",
        "preview": "<Mongo Binary Data>"
      },
      {
        "img": "<Mongo Binary Data>",
        "preview": "<Mongo Binary Data>"
      }
    ],
    "shorttext": "(CNN) -- It's been six years -- 2007, if you're into counting numbers -- since the once sleepy fishing port of Macau surpassed Las Vegas as the world leader in gambling revenue.",
    "title": "10 things to know before visiting Macau"
  },
  "_id": ObjectId("524d957a32482b7b6e000005")
},function(){});
db.collection("logs").insert({
  "date": ISODate("2013-10-03T16:04:20.246Z"),
  "user": "yeti",
  "model": "MyDesktop.modules.news.model.NewsModel",
  "actionType": "update",
  "saved": {
    "_id": ObjectId("524d3d5e48dbf5a063000001"),
    "datepubl": ISODate("2013-10-02T20:00:00.0Z"),
    "dateunpubl": ISODate("1970-01-01T00:00:00.0Z"),
    "descript": "<p>(CNN) -- It is an age-old question: will humankind ever defeat old age?<br \/>Plenty of skin care companies would like us to believe so. And now, the multinational tech giant Google would like us to think it might be possible too.<br \/>Last month Google announced a new medical company called Calico, whose explicit aim is to take on aging itself. But what will Google's approach be? And what other research into prolonging life already exists?<br \/>With its proliferation of businesses, products and services, it would be easy to forget that not so very long ago Google was just a search engine. Today, offshoots of the sprawling global corporation can be found researching self-driving cars, developing their own smart phones and tablets and even launching giant balloons into near space.<br \/>Read more: 'Afterlife' feels 'even more real than real'<br \/>Amid this growing portfolio of diffuse interests and initiatives has been added their latest company: Calico.<br \/>To really make a difference in human health you need to tackle the aging process<br \/>Jo&atilde;o Pedro de Magalh&atilde;es, biologist<br \/>Calico -- or the California Life Company -- has been set up to research subjects related to aging and its associated diseases. Announcing Calico at a media briefing, Google said that the new and independent company will largely focus on age-attendant conditions such as Alzheimer's, cancer and heart disease.<br \/>Larry Page, Google's ever youthful CEO said: \"Illness and aging affect all our families. With some longer term, moonshot thinking around healthcare and biotechnology, I believe we can improve millions of lives.\"<br \/>But the question is, what will Calico actually do? At the moment the company isn't giving much detail away: \"(Incoming CEO Arthur Levinson) and I are excited about tackling aging and illness,\" Page wrote in his Google+ blog post. But repeated requests from CNN to interview either Page or Levinson were politely declined.<br \/>Read more: Scientists build human brain inside a computer<br \/>In the absence of any real information, many commentators have speculated that Calico will pursue a 'big-data' approach to health: gathering massive amounts of information from patients and 'crunching it' to help speed the way to health care discoveries. Some have suggested that Calico's new CEO will take the view that the best way to tackle aging is to focus on preventing diseases.<br \/>Aubrey de Grey<br \/>Aubrey de Grey<br \/>The goal of Calico is to keep people healthy irrespective of their age, and ill-health is the main cause of death, so increased longevity will be an inevitable and excellent side-effect of such work.<br \/>Aubrey de Grey, Chief Science Officer of SENS Foundation<br \/>Aubrey de Grey, an expert in the field of regenerative medicine, told CNN that it is too soon to speculate on what Google's approach will be: \"in relation to Calico, I think it's vital to keep in mind that there is essentially no concrete information about their planned direction and emphasis, and any guess that they will take a heavily data-driven approach is no more than a guess.\"<br \/>However, he does think that Calico will not limit its focus to a single disease: \"The statements from Page and Levinson thus far indicate quite strongly that the emphasis will not be just cancer, or even just a range of specific diseases, but will be 'aging itself': Page in particular has highlighted the paltry longevity gains that would arise even from totally eliminating cancer.\"<br \/>Jo&atilde;o Pedro de Magalh&atilde;es, a Portuguese biologist who leads the Integrative Genomics of Aging group at the University of Liverpool, agrees: \"From what I've read, I don't think the company will mostly focus on cancer. In the Time interview Larry Page clearly states that solving cancer is 'not as big an advance as you might think'. This is reminiscent of what experts studying aging have been saying for a while, which is that to really make a difference in human health and longevity you need to tackle the aging process rather than individual age-related diseases.\"<br \/>Read more: Secrets spilled in life's final minutes<br \/>So where might Calico's focus lie? A broad range of technologies and therapies that promise life extension through different means are currently being researched and tested. CNN Labs takes a look across the scientific landscape to bring you the view from the front line of the war against aging.<br \/>Cryonics<br \/>Cryonics is a process where the body -- or occasionally just the head -- is suspended in liquid nitrogen to 'preserve' it indefinitely. The idea is that in the future the body will be able to be resuscitated and brought back to life.<br \/>Once the preserve of celebrities and multimillionaires, cryonics is now gaining traction among the broader public. Several months ago, The Sunday Times reported that three senior staff at Oxford University have signed up to have their bodies frozen with two U.S.-based cyonics organizations: the Cryonics Institute and the Alcor Life Extension Foundation.<br \/>The head of Russian cryonics firm KrioRus, Danila Medvedev, looks inside a liquid nitrogen filled human storage unit<br \/>The head of Russian cryonics firm KrioRus, Danila Medvedev, looks inside a liquid nitrogen filled human storage unit<br \/>The cost of cryonics can vary wildly. The lowest price at the Cryonics Institute is reportedly $28,000 for 'cryopreservation'; Alcor Life charges customers up to $200,000 for similar services. But does it work?<br \/>The Cryonics Institute underline on their website that, as yet, their treatments are based on projections of technology to come rather than present day science: \"We firmly believe that with the incredible advances being made in nanotechnology, medicine and science today, cryonics has the same potential to become an everyday reality in the not-so-distant future ... The goal of cryonics is to halt (the 'dying') process as quickly as possible after legal death, giving future doctors the best possible chance of reviving the patient by repairing or replacing damaged tissues, or even entire organs using advanced computer, nanotech and medical equipment and procedures\".<br \/>Read: The 'killer app' that could help save lives<br \/>Cryotherapy<br \/>A cryotherapy chamber in the Olympic Sports Centre in Spala, near the Polish capital Warsaw<br \/>A cryotherapy chamber in the Olympic Sports Centre in Spala, near the Polish capital Warsaw<br \/>The related field of cryotherapy has gained currency in some quarters of athletics, with coaches immersing their athletes in cryotherapy chambers during or after exercise in a bid to aid training and heal injuries. The French soccer team used cryotherapy during the European Cup in 2012, and the Wales rugby union squad use it as well. Cryotherapeutic chambers expose players to very low temperatures -- around minus 256 degrees Fahrenheit (minus 160 Celsius) -- for short periods. Some theorists believe that doing so can help speed the body's recovery, but others say that the evidence is incomplete.<br \/>Self-healing worms and telomeres<br \/>In 2012 a group of scientists at Nottingham University discovered that a species of flatworm -- the Planarian worm --can divide 'potentially forever' and thus heal itself. Some researchers hope that the discovery will provide fresh insight into how it may be possible to alleviate aging in human cells.<br \/>Dr Aziz Aboobaker from Nottingham University's School of Biology, said: \"Usually when stem cells divide -- to heal wounds, or during reproduction or for growth -- they start to show signs of aging. This means that the stem cells are no longer able to divide and so become less able to replace exhausted specialized cells in the tissues of our bodies. Our aging skin is perhaps the most visible example of this effect. Planarian worms and their stem cells are somehow able to avoid the aging process and to keep their cells dividing.\"<br \/>According to researchers looking at the worm, the key may be in understanding the function of telomeres -- the ends of a chromosome that protect cells against degradation.<br \/>In 2009 three scientists won the Nobel Prize in Physiology or Medicine for their work on how telomeres protect chromosomes from degradation.<br \/>One theory suggests that if we can work out a way to preserve telomeres, then we would be another step closer to defeating aging.<br \/>Read: How the search for aliens helps life on Earth<br \/>Cloning and body part replacement<br \/>An artist\\'s impression of a 3D-printed heart<br \/>An artist's impression of a 3D-printed heart<br \/>Another major area of investigation is looking into organ creation and replacement. Many people die due to organ failure, but imagine if you could just create your own new liver and replace a faulty one?<br \/>Scientists have already successfully implanted functioning lab-grown kidneys into rats. If the therapy could be successfully (and affordably) replicated for humans, it could help overcome the significant organ donor shortages that persist in many countries. Early work into creating organs using 3D printers has also yielded promising results.<br \/>Nanotechnology<br \/>Organ replacement will probably only ever be part of the solution however. Many scientists believe that longevity through repairing the human body requires a broader focus than just replacing individual parts.<br \/>Ray Kurzweil, an American author, inventor and futurist argues in his book The Singularity is Near that by the 2020s, nanotechnology may be able to help cure disease. Kurzweil says that deploying tiny robots (or 'nanobots') in the body could help overcome the problems of incorrect DNA replication -- one of the central causes of aging.<br \/>de Grey says that nanotechnological research is interesting, but that he believes it is further away from finding a solution to aging than some other treatments: \"I pay attention to molecular manufacturing (the discipline that coined the term \"nanotechnology\" but then effectively had it stolen by the field of nanomaterials), but I think its relevance to medical interventions, whether in aging or otherwise, still seems likely to be further off than the more traditionally biomedical work\".<br \/>So will Google's new company discover a workable solution to aging and death? Only time will tell.<\/p>",
    "mtime": ISODate("2013-10-03T13:56:12.664Z"),
    "ontop": false,
    "photos": [
      {
        "img": "<Mongo Binary Data>",
        "preview": "<Mongo Binary Data>"
      }
    ],
    "shorttext": "(CNN) -- It is an age-old question: will humankind ever defeat old age?\nPlenty of skin care companies would like us to believe so. ",
    "title": "How Google's Calico aims to fight aging and 'solve death'"
  },
  "_id": ObjectId("524d958432482b7b6e000006")
},function(){});

/** mainmenu records **/
db.collection("mainmenu").insert({
  "_id": ObjectId("524d0b189072cc0d49000001"),
  "dir": "",
  "leaf": false,
  "mtime": ISODate("2013-10-03T06:20:23.687Z"),
  "name": "All menus",
  "root": true
},function(){});
db.collection("mainmenu").insert({
  "_id": ObjectId("524d0dd0de3592ea4f000001"),
  "dir": "",
  "indx": NumberInt(0),
  "mtime": ISODate("2013-10-03T06:25:20.943Z"),
  "name": "Top menu",
  "pid": ObjectId("524d0b189072cc0d49000001")
},function(){});
db.collection("mainmenu").insert({
  "mtime": ISODate("2013-10-03T06:32:26.931Z"),
  "pid": ObjectId("524d0dd0de3592ea4f000001"),
  "name": "About Us",
  "dir": "\/about\/",
  "_id": ObjectId("524d0f7ade3592ea4f000003")
},function(){});
db.collection("mainmenu").insert({
  "mtime": ISODate("2013-10-03T06:32:30.199Z"),
  "pid": ObjectId("524d0dd0de3592ea4f000001"),
  "name": "Sevices",
  "dir": "\/sevices\/",
  "_id": ObjectId("524d0f7ede3592ea4f000005")
},function(){});
db.collection("mainmenu").insert({
  "_id": ObjectId("524d0ff9946a630a59000001"),
  "dir": "",
  "indx": 1,
  "mtime": ISODate("2013-10-03T06:34:55.179Z"),
  "name": "Bottom menu",
  "pid": ObjectId("524d0b189072cc0d49000001")
},function(){});
db.collection("mainmenu").insert({
  "mtime": ISODate("2013-10-03T06:36:32.452Z"),
  "pid": ObjectId("524d0dd0de3592ea4f000001"),
  "name": "Downloads",
  "dir": "\/downloads\/",
  "_id": ObjectId("524d1070946a630a59000004")
},function(){});
db.collection("mainmenu").insert({
  "mtime": ISODate("2013-10-03T06:36:35.711Z"),
  "pid": ObjectId("524d0dd0de3592ea4f000001"),
  "name": "Articles",
  "dir": "\/articles\/",
  "_id": ObjectId("524d1073946a630a59000006")
},function(){});
db.collection("mainmenu").insert({
  "mtime": ISODate("2013-10-03T06:36:38.163Z"),
  "pid": ObjectId("524d0dd0de3592ea4f000001"),
  "name": "Contacts",
  "dir": "\/contacts\/",
  "_id": ObjectId("524d1076946a630a59000008")
},function(){});
db.collection("mainmenu").insert({
  "_id": ObjectId("524d1096946a630a5900000a"),
  "dir": "\/about\/",
  "indx": NumberInt(0),
  "mtime": ISODate("2013-10-03T06:37:10.87Z"),
  "name": "About Us",
  "pid": ObjectId("524d0ff9946a630a59000001")
},function(){});
db.collection("mainmenu").insert({
  "_id": ObjectId("524d109f946a630a5900000c"),
  "dir": "\/contacts\/",
  "indx": NumberInt(2),
  "mtime": ISODate("2013-10-03T06:37:19.688Z"),
  "name": "Contacts",
  "pid": ObjectId("524d0ff9946a630a59000001")
},function(){});
db.collection("mainmenu").insert({
  "_id": ObjectId("524d82875ee8bcbd1f000006"),
  "dir": "\/news\/",
  "indx": 1,
  "mtime": ISODate("2013-10-03T14:43:19.647Z"),
  "name": "News",
  "pid": ObjectId("524d0ff9946a630a59000001")
},function(){});

/** news records **/
db.collection("news").insert({
  "_id": ObjectId("524d3750caf87bf141000001"),
  "datepubl": ISODate("2013-10-02T20:00:00.0Z"),
  "dateunpubl": ISODate("1970-01-01T00:00:00.0Z"),
  "descript": "<p>But almost all the rest of NASA has been shuttered, just one of many federal agencies affected when the government shut down at midnight Tuesday because of Congress' inability to pass a budget.<br \/>NASA: Voyager has left the solar system The shutdown and national security Welch: Both sides deserve a spanking<br \/>Many of those agencies took to social media and other online venues to share the news. Twitter was a popular choice for the messages.<br \/>Among them? If an asteroid starts hurtling toward Earth ... well ... good luck.<br \/>\"In the event of government shutdown, we will not be posting or responding from this account,\" NASA's Near Earth Object Office tweeted from its @AsteroidWatch account Monday, just hours before the deadline in Congress. \"We sincerely hope to resume tweets soon.\"<br \/>The office is responsible for tracking and reporting asteroids that threaten the planet, like the 150-foot chunk of space rock that came closer to Earth than the moon in February.<br \/>The office later noted that observatories, academics and other astronomers continue to monitor the skies.<br \/>In all, about 18,000 NASA employees, or 97% of its work force, were furloughed on Tuesday.<br \/>Among those still working will be astronauts aboard the International Space Station. Which may be just as well -- it's not like they could get away from the office even if they wanted to.<br \/>NASA's Mission Control will also stay open to support astronauts Karen Nyberg and Mike Hopkins.<br \/>\"To protect the life of the crew as well as the assets themselves, we would continue to support planned operations of the ISS [space station] during any funding hiatus,\" reads a NASA furlough plan submitted last week. \"Moreover, NASA will be closely monitoring the impact of an extended shutdown to determine if crew transportation or cargo resupply services are required to mitigate imminent threats to life and property on the ISS or other areas.\"<br \/>Other NASA spacecraft, like the Curiosity Rover on Mars and the New Horizons craft hurtling toward Pluto, will be largely left to their own devices (literally) during the shutdown.<br \/>The funding mess may be enough to have them all jealous of the Voyager 1 space probe, which was launched into space in 1977.<br \/>Last month, NASA confirmed that the original Voyager left the solar system. Maybe the Voyager 2 probe, in protest of the impasse in Congress, will follow suit.<\/p>",
  "mtime": ISODate("2013-10-03T12:50:58.781Z"),
  "ontop": true,
  "photos": [
    
  ],
  "shorttext": "(CNN) -- Two U.S. astronauts in space, and their support staffs on Earth, will keep working through the government shutdown that began Tuesday.",
  "title": "NASA grounded by government shutdown"
},function(){});
db.collection("news").insert({
  "mtime": ISODate("2013-10-03T12:56:38.767Z"),
  "title": "Bionic leg helps shark-attack victim walk",
  "datepubl": ISODate("2013-10-02T20:00:00.0Z"),
  "dateunpubl": ISODate("1970-01-01T00:00:00.0Z"),
  "shorttext": "(CNN) -- Craig Hutto lost his right leg in a shark attack when he was 16 years old.\nSoon after that he became one of the first people to test out a new prosthetic leg created at Vanderbilt University. Researchers there have developed the first fully robotic artificial leg for above-knee amputees. The \"bionic leg,\" as it is called, uses a variety of sensors and motors that replicate muscle and joint movement in a healthy limb.",
  "ontop": false,
  "descript": "<p>(CNN) -- Craig Hutto lost his right leg in a shark attack when he was 16 years old.<br \/>Soon after that he became one of the first people to test out a new prosthetic leg created at Vanderbilt University. Researchers there have developed the first fully robotic artificial leg for above-knee amputees. The \"bionic leg,\" as it is called, uses a variety of sensors and motors that replicate muscle and joint movement in a healthy limb.<br \/>This mechanism creates a more natural stride and allows users to do things that are not possible with normal prosthesis, such as run or go up and down steps and inclines in a natural way.<br \/>While we're not quite at the point of \"The Six Million Dollar Man\" bionics, exoskeleton technology is starting to show real promise in helping people with disabilities.<br \/>Check out the video above to see the bionic leg in action.<\/p>",
  "photos": [
    
  ],
  "_id": ObjectId("524d69865ea014016b000008")
},function(){});
db.collection("news").insert({
  "_id": ObjectId("524d3d5e48dbf5a063000001"),
  "datepubl": ISODate("2013-10-02T20:00:00.0Z"),
  "dateunpubl": ISODate("1970-01-01T00:00:00.0Z"),
  "descript": "<p>(CNN) -- It is an age-old question: will humankind ever defeat old age?<br \/>Plenty of skin care companies would like us to believe so. And now, the multinational tech giant Google would like us to think it might be possible too.<br \/>Last month Google announced a new medical company called Calico, whose explicit aim is to take on aging itself. But what will Google's approach be? And what other research into prolonging life already exists?<br \/>With its proliferation of businesses, products and services, it would be easy to forget that not so very long ago Google was just a search engine. Today, offshoots of the sprawling global corporation can be found researching self-driving cars, developing their own smart phones and tablets and even launching giant balloons into near space.<br \/>Read more: 'Afterlife' feels 'even more real than real'<br \/>Amid this growing portfolio of diffuse interests and initiatives has been added their latest company: Calico.<br \/>To really make a difference in human health you need to tackle the aging process<br \/>Jo&atilde;o Pedro de Magalh&atilde;es, biologist<br \/>Calico -- or the California Life Company -- has been set up to research subjects related to aging and its associated diseases. Announcing Calico at a media briefing, Google said that the new and independent company will largely focus on age-attendant conditions such as Alzheimer's, cancer and heart disease.<br \/>Larry Page, Google's ever youthful CEO said: \"Illness and aging affect all our families. With some longer term, moonshot thinking around healthcare and biotechnology, I believe we can improve millions of lives.\"<br \/>But the question is, what will Calico actually do? At the moment the company isn't giving much detail away: \"(Incoming CEO Arthur Levinson) and I are excited about tackling aging and illness,\" Page wrote in his Google+ blog post. But repeated requests from CNN to interview either Page or Levinson were politely declined.<br \/>Read more: Scientists build human brain inside a computer<br \/>In the absence of any real information, many commentators have speculated that Calico will pursue a 'big-data' approach to health: gathering massive amounts of information from patients and 'crunching it' to help speed the way to health care discoveries. Some have suggested that Calico's new CEO will take the view that the best way to tackle aging is to focus on preventing diseases.<br \/>Aubrey de Grey<br \/>Aubrey de Grey<br \/>The goal of Calico is to keep people healthy irrespective of their age, and ill-health is the main cause of death, so increased longevity will be an inevitable and excellent side-effect of such work.<br \/>Aubrey de Grey, Chief Science Officer of SENS Foundation<br \/>Aubrey de Grey, an expert in the field of regenerative medicine, told CNN that it is too soon to speculate on what Google's approach will be: \"in relation to Calico, I think it's vital to keep in mind that there is essentially no concrete information about their planned direction and emphasis, and any guess that they will take a heavily data-driven approach is no more than a guess.\"<br \/>However, he does think that Calico will not limit its focus to a single disease: \"The statements from Page and Levinson thus far indicate quite strongly that the emphasis will not be just cancer, or even just a range of specific diseases, but will be 'aging itself': Page in particular has highlighted the paltry longevity gains that would arise even from totally eliminating cancer.\"<br \/>Jo&atilde;o Pedro de Magalh&atilde;es, a Portuguese biologist who leads the Integrative Genomics of Aging group at the University of Liverpool, agrees: \"From what I've read, I don't think the company will mostly focus on cancer. In the Time interview Larry Page clearly states that solving cancer is 'not as big an advance as you might think'. This is reminiscent of what experts studying aging have been saying for a while, which is that to really make a difference in human health and longevity you need to tackle the aging process rather than individual age-related diseases.\"<br \/>Read more: Secrets spilled in life's final minutes<br \/>So where might Calico's focus lie? A broad range of technologies and therapies that promise life extension through different means are currently being researched and tested. CNN Labs takes a look across the scientific landscape to bring you the view from the front line of the war against aging.<br \/>Cryonics<br \/>Cryonics is a process where the body -- or occasionally just the head -- is suspended in liquid nitrogen to 'preserve' it indefinitely. The idea is that in the future the body will be able to be resuscitated and brought back to life.<br \/>Once the preserve of celebrities and multimillionaires, cryonics is now gaining traction among the broader public. Several months ago, The Sunday Times reported that three senior staff at Oxford University have signed up to have their bodies frozen with two U.S.-based cyonics organizations: the Cryonics Institute and the Alcor Life Extension Foundation.<br \/>The head of Russian cryonics firm KrioRus, Danila Medvedev, looks inside a liquid nitrogen filled human storage unit<br \/>The head of Russian cryonics firm KrioRus, Danila Medvedev, looks inside a liquid nitrogen filled human storage unit<br \/>The cost of cryonics can vary wildly. The lowest price at the Cryonics Institute is reportedly $28,000 for 'cryopreservation'; Alcor Life charges customers up to $200,000 for similar services. But does it work?<br \/>The Cryonics Institute underline on their website that, as yet, their treatments are based on projections of technology to come rather than present day science: \"We firmly believe that with the incredible advances being made in nanotechnology, medicine and science today, cryonics has the same potential to become an everyday reality in the not-so-distant future ... The goal of cryonics is to halt (the 'dying') process as quickly as possible after legal death, giving future doctors the best possible chance of reviving the patient by repairing or replacing damaged tissues, or even entire organs using advanced computer, nanotech and medical equipment and procedures\".<br \/>Read: The 'killer app' that could help save lives<br \/>Cryotherapy<br \/>A cryotherapy chamber in the Olympic Sports Centre in Spala, near the Polish capital Warsaw<br \/>A cryotherapy chamber in the Olympic Sports Centre in Spala, near the Polish capital Warsaw<br \/>The related field of cryotherapy has gained currency in some quarters of athletics, with coaches immersing their athletes in cryotherapy chambers during or after exercise in a bid to aid training and heal injuries. The French soccer team used cryotherapy during the European Cup in 2012, and the Wales rugby union squad use it as well. Cryotherapeutic chambers expose players to very low temperatures -- around minus 256 degrees Fahrenheit (minus 160 Celsius) -- for short periods. Some theorists believe that doing so can help speed the body's recovery, but others say that the evidence is incomplete.<br \/>Self-healing worms and telomeres<br \/>In 2012 a group of scientists at Nottingham University discovered that a species of flatworm -- the Planarian worm --can divide 'potentially forever' and thus heal itself. Some researchers hope that the discovery will provide fresh insight into how it may be possible to alleviate aging in human cells.<br \/>Dr Aziz Aboobaker from Nottingham University's School of Biology, said: \"Usually when stem cells divide -- to heal wounds, or during reproduction or for growth -- they start to show signs of aging. This means that the stem cells are no longer able to divide and so become less able to replace exhausted specialized cells in the tissues of our bodies. Our aging skin is perhaps the most visible example of this effect. Planarian worms and their stem cells are somehow able to avoid the aging process and to keep their cells dividing.\"<br \/>According to researchers looking at the worm, the key may be in understanding the function of telomeres -- the ends of a chromosome that protect cells against degradation.<br \/>In 2009 three scientists won the Nobel Prize in Physiology or Medicine for their work on how telomeres protect chromosomes from degradation.<br \/>One theory suggests that if we can work out a way to preserve telomeres, then we would be another step closer to defeating aging.<br \/>Read: How the search for aliens helps life on Earth<br \/>Cloning and body part replacement<br \/>An artist\\'s impression of a 3D-printed heart<br \/>An artist's impression of a 3D-printed heart<br \/>Another major area of investigation is looking into organ creation and replacement. Many people die due to organ failure, but imagine if you could just create your own new liver and replace a faulty one?<br \/>Scientists have already successfully implanted functioning lab-grown kidneys into rats. If the therapy could be successfully (and affordably) replicated for humans, it could help overcome the significant organ donor shortages that persist in many countries. Early work into creating organs using 3D printers has also yielded promising results.<br \/>Nanotechnology<br \/>Organ replacement will probably only ever be part of the solution however. Many scientists believe that longevity through repairing the human body requires a broader focus than just replacing individual parts.<br \/>Ray Kurzweil, an American author, inventor and futurist argues in his book The Singularity is Near that by the 2020s, nanotechnology may be able to help cure disease. Kurzweil says that deploying tiny robots (or 'nanobots') in the body could help overcome the problems of incorrect DNA replication -- one of the central causes of aging.<br \/>de Grey says that nanotechnological research is interesting, but that he believes it is further away from finding a solution to aging than some other treatments: \"I pay attention to molecular manufacturing (the discipline that coined the term \"nanotechnology\" but then effectively had it stolen by the field of nanomaterials), but I think its relevance to medical interventions, whether in aging or otherwise, still seems likely to be further off than the more traditionally biomedical work\".<br \/>So will Google's new company discover a workable solution to aging and death? Only time will tell.<\/p>",
  "mtime": ISODate("2013-10-03T16:04:20.244Z"),
  "ontop": false,
  "photos": [
    
  ],
  "shorttext": "(CNN) -- It is an age-old question: will humankind ever defeat old age?\nPlenty of skin care companies would like us to believe so. ",
  "title": "How Google's Calico aims to fight aging and 'solve death'"
},function(){});
db.collection("news").insert({
  "_id": ObjectId("524d68fe5ea014016b000004"),
  "datepubl": ISODate("2013-10-02T20:00:00.0Z"),
  "dateunpubl": ISODate("1970-01-01T00:00:00.0Z"),
  "descript": "<p>(CNN) -- For many victims, California's new \"revenge porn\" law doesn't go far enough.<br \/>Revenge porn, also called cyber revenge, is the act of posting sexual photos of an ex-lover online for vengeance. The photos were typically exchanged consensually over the course of a relationship and meant only for the other person.<br \/>There are websites dedicated to posting and making money off of these types of shots, which are primarily of women.<br \/>The new California law, which was signed into law on Tuesday by Gov. Jerry Brown, is only the second revenge porn-specific piece of legislation in the United States. Under the law, people convicted of distributing sexual images of exes face six months of jail time and a $1,000 fine.<br \/> Victim of 'revenge porn': It has to stop Women sue 'revenge porn' website 2012: 'Revenge porn' site defended<br \/>Critics say the law has some glaring loopholes. It only applies when the person accused of spreading the images online is also the photographer. It does not cover photos a person takes of themselves and shares with a lover, say during a sexting session.<br \/>Up to 80% of revenge porn victims had taken the photos of themselves, according to a recent survey by the Cyber Civil Rights Initiative. CCRI is a group founded by revenge porn victims and activists to push for legal reform in the United States. That means the vast majority of revenge porn cases would not qualify under this law.<br \/>\"I definitely don't think this bill goes far enough, though it is a step in the right direction,\" said CCRI's Holly Jacobs, who became a prominent anti-revenge porn activist after she was a victim herself. In Jacobs' case, most of her photos posted online were self-shots but some were taken by her ex.<br \/>\"We would only have been able to follow through with the charges if we linked his IP address to the pictures that he took of me, not those that I took of myself,\" said Jacobs.<br \/>Mary Anne Franks, a law professor at Miami Law School who is on the board at CCRI, said one of the possible reasons the law did not include self-shots is that the distinction was required so people who sent unsolicited nude photos of themselves were not covered. However, the law does specifically state that photos be taken \"under circumstances where the parties agree or understand that the image shall remain private.\"<br \/>\"I think we are really looking at a 'blame the victim' mentality here,\" said Franks, meaning people who take the photos of themselves were \"asking for it.\"<br \/>\"It's disturbing that the drafters apparently think that some victims of nonconsensual pornography are not worth protecting,\" said Franks.<br \/>Another issue is that there could be difficulty enforcing the law even in cases that do qualify. The law applies to people who post photos to \"harass or annoy\" and the perpetrators must have \"intent to cause serious emotional distress.\" That could exclude people who post these types of images only for financial gain or other reasons like bragging rights. The sites that make money off of submitted revenge porn might be able to avoid prosecution by claiming they did not know the victims and therefore couldn't have intended any harm.<br \/>\"Until now, there was no tool for law enforcement to protect victims,\" California state Sen. Anthony Cannella said in a statement. Cannella was one of the main authors of the new law. \"Too many have had their lives upended because of an action of another that they trusted.\"<br \/>Cannella's office did not immediately respond to a request for comment regarding criticisms of the law.<br \/>Previously, victims of revenge porn had limited recourse when photos taken with consent were posted online. A person could sue the ex who uploaded the images or the site hosting them for invasion of privacy, but it didn't constitute harassment under California state laws. Victims would have had to pay for a costly civil suit.<br \/>California is only the second state to have a law that addresses revenge porn. New Jersey has had a related law since 2003 that makes it a felony to post secretly recorded videos or photos online.<br \/>Now other states are considering their own revenge porn laws, including New York and Wisconsin. Franks has been working with both states on early drafts of their laws, and she says that so far it looks like both avoid what she considers the weaknesses of the California law and include First Amendment protections.<br \/>Activists would also like to see a federal law address revenge porn.<br \/>Early on, the ACLU voiced concerns about the California law's potentially negative impact on free speech, for example, if someone wanted to share a photo that had political implications or if a photo or video contained evidence of a crime.<br \/>Florida was considering a revenge porn law but scrapped it following First Amendment concerns.<br \/>The California bill contains an urgency clause, meaning it will go into effect immediately. The first few cases will show how effective the new legislation is in curbing revenge porn. Since it's nearly impossible to scrub an image from the Internet once it has gone viral, the best possible outcome is that the law discourages people from seeking this type of revenge in the first place.<\/p>",
  "mtime": ISODate("2013-10-03T13:32:37.581Z"),
  "ontop": true,
  "photos": [
    
  ],
  "shorttext": "Revenge porn, also called cyber revenge, is the act of posting sexual photos of an ex-lover online for vengeance. ",
  "title": "New California 'revenge porn' law may miss some victims"
},function(){});
db.collection("news").insert({
  "_id": ObjectId("524d69375ea014016b000006"),
  "datepubl": ISODate("2013-10-02T20:00:00.0Z"),
  "dateunpubl": ISODate("1970-01-01T00:00:00.0Z"),
  "descript": "<p>New research suggests, however, that scientists may have been looking for the wrong kind of volcanoes.<br \/>A new study in the journal Nature argues that a handful of geological formations on Mars that were thought of as impact craters were once, instead, supervolcanoes. They never looked like mountains; rather, they formed when the ground collapsed on itself in violent explosions.<br \/>\"This is a totally new kind of process that we hadn't thought about for Mars, and it changes the way we view the evolution of the planet,\" said lead study author Joseph Michalski of the Planetary Science Institute in Tucson, Arizona, and the National History Museum in London.<br \/>The volcanic eruptions likely represented the biggest explosions in the history of Mars, Michalski said. These explosions would have occurred more than 3.5 billion years ago.<br \/>Follow CNN Science News<\/p>\n<p>Facebook: CNNScience<\/p>\n<p>Twitter: @CNNLightYears<br \/>He and NASA colleague Jacob Bleacher focused on a region on Mars called Arabia Terra, which is speckled with craters. Bleacher could not discuss the study Wednesday, Michalski said, because of the United States government shutdown that furloughed most of NASA's employees. (But Mars rover operations, including driving and using scientific instruments, are continuing this week, a NASA spokesman said).<br \/>NASA on shutdown: 'Sort it out, humans'<br \/>The researchers used data from instruments aboard several orbiters: Mars Express, the Mars Reconnaissance Orbiter, the Mars Global Surveyor and Mars Odyssey.<br \/>Particularly intriguing to them was a crater called Eden Patera, which did not have features consistent with an impact crater. Instead, it resembled a structure seen on Earth called a caldera, which is a volcano that has collapsed inward (caldera is also the Spanish word for cauldron.)<br \/>They believe Eden Patera is the best example of a possible ancient supervolcano on Mars.<br \/> Auditions for a one-way ticket to Mars<br \/>When you think of a volcano, a cone-shaped structure protruding from the ground probably comes to mind. These, such as Mauna Loa in Hawaii, are essentially mountains of lava. But Eden Patera and other supervolcanoes on Mars never looked like that; instead, they represent the inward collapse of Martian terrain.<br \/>Eden Patera and other supervolcanoes would have been much smaller than Olympus Mons, a shield volcano on Mars about the size of the state of Arizona, and the biggest volcano in the solar system. But while Olympus Mons oozed lava, the supervolcano explosions would have been much more powerful, Michalski said -- they would have thrown material all around the planet.<br \/>By comparison, Mount St. Helens erupted on Earth in 1980, spewing more than 0.24 cubic miles (1 cubic kilometer) of material over Washington state and surrounding areas. Supervolcanoes can produce eruptions spouting more than 1,000 times more volcanic material than that.<br \/>Six must-see volcanoes on Earth<br \/>How a supervolcano collapses<br \/>How calderas such as Eden Patera form is similar to the process that created what is today Yellowstone National Park, Michalski said. A supervolcano there exploded 640,000 years ago; there was no mountain-like structure there beforehand.<br \/>Had you been there, said Michalski, you would have been standing around in Wyoming and observing a bit of steam coming out of the ground. You would start to feel earthquakes because of the movement of magma underneath you, causing the earth to crack and break.<br \/>Bigger and bigger earthquakes would have given way to smaller explosions from within the ground. That happens because as the magma produces bubbles, pressure would build up and blows up the terrain; destabilization would lead to more earthquakes and then -- boom! -- a massive explosion.<br \/>Such explosions would send ash far into the atmosphere, creating lots of heat and gas. The wind would carry away the ash, and while much of it would rain down to form layered materials on Earth, some ash would stay in the atmosphere for years to come<br \/>\"By the time you'd get to see that, you'll be dead, because it's quite a massive, violent activity,\" Michalski said. \"No one's really ever witnessed it, because if you did, you wouldn't be here to tell about it.\"<br \/>Water discovered in Martian soil<br \/>Why it matters<br \/>Supervolcanoes were instrumental in shaping geological formations and the climate on our own planet, and the same goes for Mars, Michalski said.<br \/>Eruptions would have sent the climate into a tailspin of global cooling or warming, or both, because of competing environmental processes, he said. The volcanic explosions emitted greenhouse gas and unleashed ash into the atmosphere, which blocks out the sun.<br \/>\"That would have had a strong impact on what the climate and what the environment was like at geologically relevant time scales,\" he said.<br \/>Understanding supervolcanoes could give scientists new clues into the early Martian atmosphere and explain various features of the planet's geology. Material from the eruptions may even be responsible for some of the rocks that the Mars rover Curiosity has been encountering since it landed on August 6, 2012.<br \/>Mars may be home to even more ancient supervolcanoes that today look like impact craters, researchers say.<br \/>Stephanie C. Werner, planetology researcher at the University of Oslo, who was not involved in the study, believes some of the conclusions of this new study are speculative and not based on a firm timescale. More research is needed to better determine whether this supervolcano activity really predates other significant volcanic episodes, specifically, those that occurred in the Tharsis region of Mars, she said.<br \/>\"One thing lacking in this study is the constraint on the timing of these events, to fully evaluate the impact on atmosphere evolution and impact on climate,\" she said in an e-mail. \"Nonetheless, events related to the formation of these landforms can have significant influence and may be important if no other activity occurred at the same time.\"<br \/>More orbital data would help resolve unanswered questions about the ancient supervolcanoes, Michalski said.<br \/>Like magma under an active fault, such discussions will continue bubbling among members of the community of scientists who study Mars.<br \/>Follow Elizabeth Landau on Twitter at @lizlandau<\/p>",
  "mtime": ISODate("2013-10-03T13:56:32.652Z"),
  "ontop": true,
  "photos": [
    
  ],
  "shorttext": "(CNN) -- Scientists have long predicted that Mars had significant volcanic activity in the first billion years of its history, but images of the planet's surface haven't delivered as much evidence of volcanoes as they expected.",
  "title": "Scientists find evidence of supervolcanoes on Mars"
},function(){});
db.collection("news").insert({
  "_id": ObjectId("524d91a132482b7b6e000001"),
  "datepubl": ISODate("2013-10-02T20:00:00.0Z"),
  "dateunpubl": ISODate("1970-01-01T00:00:00.0Z"),
  "descript": "<p>We love the flash. And the occasional winning night at the tables.<br \/>But there's a slower side to this city of just less than 600,000 residents, one of cobblestone lanes, colonial mansions, art deco buildings and tranquil parks, all done in a fusion of Chinese and Portuguese motifs.<br \/>The best part is that Macau (just an hour from Hong Kong by ferry) is compact, making it a breeze to explore.<br \/>Here's a primer.<br \/>1. Baccarat is the game of choice<br \/>Macau is the gambling capital of the world.<br \/>By far the most popular game is baccarat, a relatively simple game with a low house advantage (less than 1%).<br \/>Baccarat tables dominate the city's 33 casinos.<br \/>There are plenty of slot machines as well, but they offer a high house advantage and aren't popular. This is the reverse of Las Vegas where gamblers favor slots.<br \/>Macau's revenue from gambling is $33 billion, more than five times that of the Las Vegas Strip.<br \/>Tycoon Stanley Ho's 40-year reign as the city's casino kingpin came to an end in 2002 when the Macau government ended the monopoly system.<br \/>Today, there are six casino operators: SJM Holdings (Stanley Ho), Wynn Macau, Sands China, Galaxy Entertainment Group, MGM China Holdings and Melco Crown Entertainment.<br \/>After 443 years of Portuguese rules, Macau offers an authentic European experience.<br \/>After 443 years of Portuguese rules, Macau offers an authentic European experience.<br \/>2. Macau was the first and last European colony in China<br \/>The Portuguese settled in Macau in the 16th century and the island was handed back to China in 1999.<br \/>Today, Macau is a Special Administrative Region (SAR) -- as is Hong Kong -- and is governed under the \"one country, two systems\" principal, which was the brainchild of late paramount leader Deng Xiaoping.<br \/>Although no longer a colony, Portuguese is still an official language and the Portuguese influence can be seen everywhere from blue tiled street signs to tiled floors and beautiful gardens.<br \/>More: Top-notch hotel under $100: Macau's best boutique stay<br \/>3. It's the world's most densely populated place<br \/>Macau has the world's highest population density with 20,497 people per square kilometer.<br \/>No surprise then that it needed to do something dramatic to make room for new casinos and 30 million visitors that come every year.<br \/>The solution was a massive land reclamation project that joined the two islands south of the mainland -- Coloane and Taipa. This gave Macau an extra 5.2 square kilometers to create a gambling mecca to rival Las Vegas.<br \/>It's known as the Cotai Strip -- drawing on the names of the two islands, Coloane and Taipa.<br \/>The Venetian Resort, City of Dreams, Sands Cotai and Galaxy Macau Resort are all on the Cotai Strip.<br \/>There's another big one on the way -- Steve Wynn is spending $4 billion on a huge resort called Wynn Palace set to open in 2016.<br \/>4. Coloane is still chill<br \/>The most southern island, Coloane, remains wonderfully untouched by the casino craziness.<br \/>This is largely due to strict rules over title deeds that make it difficult to buy property on the island.<br \/>The low-rise houses and quiet tree-lined streets that give Coloane its charm remain as they have for decades.<br \/>Coloane is home to Lord Stow's Bakery, birthplace of Macau's much-loved egg tart. Not too sweet, these tarts with their crispy pastry are worth queuing for.<br \/>Another Coloane favourite is Fernando's. Like the rest of Coloane, it's super laid-back and the food is reliably good. The garlic prawns and suckling pig are must orders.<br \/>More: Insider Guide: Best of Macau<br \/>Preservation is a result of foresight.<br \/>Preservation is a result of foresight.<br \/>5. Heritage is here to stay<br \/>Before the big casino operators rolled into town the Macau government did something clever -- it applied to UNESCO for World Heritage status.<br \/>In 2005, the historic center of Macau was put on the list.<br \/>The city's historic monuments are one of the city's biggest draws, a wonderful example of the early encounter between Chinese and European civilizations.<br \/>The old heart of the city is small and a walking tour can easily take in the key sites from the iconic Senado Square, the Ruins of St. Pauls, the beautiful churches and temples and the old city wall.<br \/>Most of the sites are open daily and free to visit.<br \/>Lots of influences went into that chunk of cod.<br \/>Lots of influences went into that chunk of cod.<br \/>6. Macanese cuisine is fusion food<br \/>Macanese cuisine is unique to Macau and combines the best of Chinese and Portuguese ingredients and cooking along with influences from Brazil, Goa and other former Portuguese colonies.<br \/>There's plenty of seafood -- codfish, sardines, crab -- as well as rabbit, duck and chicken.<br \/>Portuguese influence is seen in the flavoring, with plenty of turmeric, cinnamon, chili and coconut. Dishes are often baked or roasted for a long time to allow the flavors and spices to develop.<br \/>Macau's caldo verde soup is a popular starter and is similar to the Portuguese original, but uses bok choy instead of collard greens.<br \/>The national dish is minchi -- minced beef or pork cooked with potatoes, onions, soy sauce and sometimes an egg.<br \/>7. Broken Tooth is out and about<br \/>He was once Asia's most feared gangster, the leader of the 14K triads, and after 13 years behind bars he's now a free man.<br \/>Wan Kuok-koi was born in Macau's slums and worked his way up triads.<br \/>Along the way he broke several teeth in street fights and earned his nickname.<br \/>As head of the largest triad society in Macau, he and his crew waged a violent turf war against a rival gang, the Shui Fong, in the years running up to the 1999 handover. It was a time of drive-by shootings and car bombs that came to an end only when he was jailed in 1999.<br \/>Broken Tooth must have had a shock when he was released in December last year. Macau changed dramatically while he was in prison and the swathe of new monster casinos has totally transformed the city.<br \/>Today, the triads have almost total control of the junket operators and keep a low profile.<br \/>8. It's a city of longevity<br \/>People in Macau live a long time -- an average of 84.4 years.<br \/>Macau takes second place in global life expectancy.<br \/>Only the residents of Monaco -- ironically another place beginning with the letter \"M\" that's known for its casinos -- live longer (89.6 years).<br \/>The fantastic economy is thought to have a lot to do with the great life expectancy. This year Macau was named the world's second fastest growing economy (after Mongolia) and more than 50% of Macau's revenue comes from gambling.<br \/>So while the chain-smoking high rollers might be knocking off years with stressful, risky gambles, the locals are almost guaranteed their golden years.<br \/>More: 40 Hong Kong dishes we can't live without<br \/>\\<br \/>\"Dad, I told you stop visiting me at work.\"<br \/>9. One in five locals work in a casino<br \/>Macau's casinos employ 20% of the population.<br \/>When a casino takes on new staff, it checks to see if he or she has family working in the casino and in which section, to avoid the possibility of fraud.<br \/>Locals rarely visit the casinos to gamble and government employees are forbidden from gambling here. The overwhelming majority of gamblers are from mainland China and Hong Kong.<br \/>New regulations brought in early this year means that 50% of a casino floor must be non-smoking. The massive open plan Venetian Macau -- the largest casino floor in the world -- uses a smart ventilation system that creates areas of low and high pressure to ensure that the smoke is drawn up into air vents.<br \/>10. The beach has black sand<br \/>Hac Sa Beach -- which translates as \"Black Sand Bay\" -- is Macau's largest natural beach.<br \/>It's on the southeast side of Coloane Island.<br \/>The beach is a kilometer long and famous for its black sand. It gets its unique color from minerals in the seabed that are washed ashore.<br \/>The sand isn't as black as it used to be. Erosion was gradually chipping away at the beach so the government decided to top up the beach, but the replacement sand is yellow, which has muted the dark sand.<br \/>More: World's 100 best beaches<\/p>",
  "mtime": ISODate("2013-10-03T16:04:10.660Z"),
  "ontop": false,
  "photos": [
    
  ],
  "shorttext": "(CNN) -- It's been six years -- 2007, if you're into counting numbers -- since the once sleepy fishing port of Macau surpassed Las Vegas as the world leader in gambling revenue.",
  "title": "10 things to know before visiting Macau"
},function(){});

/** pages records **/
db.collection("pages").insert({
  "_id": ObjectId("524825755e2bda6409000001"),
  "access": false,
  "alias": "",
  "blocks": [
    {
      "id": "1c5371cc-6859-069e-9ad3-c2a32a6637b3",
      "block": "1",
      "controller": "default:html:news-NewsModel",
      "descript": "Text",
      "text": ""
    }
  ],
  "dir": "\/",
  "leaf": false,
  "map": false,
  "metadesctiption": "",
  "metakeywords": "",
  "metatitle": "",
  "mtime": ISODate("2013-10-03T12:15:24.817Z"),
  "name": "Homepage",
  "parents": null,
  "root": true,
  "tpl": ObjectId("52482c05e3f8c2c40a000004")
},function(){});
db.collection("pages").insert({
  "mtime": ISODate("2013-10-02T16:55:35.529Z"),
  "pid": ObjectId("524825755e2bda6409000001"),
  "parents": [
    ObjectId("524825755e2bda6409000001")
  ],
  "tpl": ObjectId("524c4d8a7fc7804269000002"),
  "name": "Articles",
  "metatitle": "",
  "metadesctiption": "",
  "metakeywords": "",
  "dir": "\/articles\/",
  "alias": "articles",
  "blocks": [
    
  ],
  "access": false,
  "map": false,
  "_id": ObjectId("524c500791db4c8d6e000006")
},function(){});
db.collection("pages").insert({
  "mtime": ISODate("2013-10-03T06:39:19.900Z"),
  "pid": ObjectId("524c500791db4c8d6e000006"),
  "parents": [
    ObjectId("524c500791db4c8d6e000006"),
    ObjectId("524825755e2bda6409000001")
  ],
  "tpl": ObjectId("524c4d8a7fc7804269000002"),
  "name": "2012",
  "metatitle": "",
  "metadesctiption": "",
  "metakeywords": "",
  "dir": "\/articles\/2012\/",
  "alias": "2012",
  "blocks": [
    
  ],
  "access": false,
  "map": false,
  "_id": ObjectId("524d1117946a630a5900000e")
},function(){});
db.collection("pages").insert({
  "mtime": ISODate("2013-10-03T06:39:31.827Z"),
  "pid": ObjectId("524c500791db4c8d6e000006"),
  "parents": [
    ObjectId("524c500791db4c8d6e000006"),
    ObjectId("524825755e2bda6409000001")
  ],
  "tpl": ObjectId("524c4d8a7fc7804269000002"),
  "name": "2013",
  "metatitle": "",
  "metadesctiption": "",
  "metakeywords": "",
  "dir": "\/articles\/2013\/",
  "alias": "2013",
  "blocks": [
    
  ],
  "access": false,
  "map": false,
  "_id": ObjectId("524d1123946a630a59000010")
},function(){});
db.collection("pages").insert({
  "_id": ObjectId("524c4fbd91db4c8d6e000002"),
  "access": false,
  "alias": "sevices",
  "blocks": [
    {
      "text": "<p><strong>More image than action?<\/strong><\/p>\n<p class=\"cnn_storypgraphtxt cnn_storypgraph6\">The carrier race comes amid rising assertiveness of Asian's military powers and changing conditions in the region.<\/p>\n<p>For Japan, it's a counter to the rising power of China and the threat from North Korea. For India, its carrier flexes its muscle in the direction of Pakistan while China wants to project power along its trade routes and regional interests.<\/p>\n<p>Just 20 aircraft carriers are active throughout the world and the U.S. Navy operates 10 of them. For many military analysts, however, the value of a carrier lies in having one rather than ever using one.<\/p>\n<p>Ashley Townshend, analyst with the Lowy Institute for International Policy, says there is a disconnect between what an aircraft carrier projects and what it can actually do.<\/p>\n<p>\"Needing an aircraft carrier and wanting one are two different things,\" Townshend told CNN, adding that Asia -- despite recent headlines -- has had a long history of aircraft carrier operation.<\/p>\n<p>\"India has operated carriers before; China hasn't but China is a new foray into carrier naval warfare\/carrier naval operations,\" he said. \"Japan interestingly had the world's first aircraft carrier.\"<\/p>\n<p><strong>More image than action?<\/strong><\/p>\n<p class=\"cnn_storypgraphtxt cnn_storypgraph6\">The carrier race comes amid rising assertiveness of Asian's military powers and changing conditions in the region.<\/p>\n<p>For Japan, it's a counter to the rising power of China and the threat from North Korea. For India, its carrier flexes its muscle in the direction of Pakistan while China wants to project power along its trade routes and regional interests.<\/p>\n<p>Just 20 aircraft carriers are active throughout the world and the U.S. Navy operates 10 of them. For many military analysts, however, the value of a carrier lies in having one rather than ever using one.<\/p>\n<p>Ashley Townshend, analyst with the Lowy Institute for International Policy, says there is a disconnect between what an aircraft carrier projects and what it can actually do.<\/p>\n<p>\"Needing an aircraft carrier and wanting one are two different things,\" Townshend told CNN, adding that Asia -- despite recent headlines -- has had a long history of aircraft carrier operation.<\/p>\n<p>\"India has operated carriers before; China hasn't but China is a new foray into carrier naval warfare\/carrier naval operations,\" he said. \"Japan interestingly had the world's first aircraft carrier.\"<\/p>\n<p><strong>More image than action?<\/strong><\/p>\n<p class=\"cnn_storypgraphtxt cnn_storypgraph6\">The carrier race comes amid rising assertiveness of Asian's military powers and changing conditions in the region.<\/p>\n<p>For Japan, it's a counter to the rising power of China and the threat from North Korea. For India, its carrier flexes its muscle in the direction of Pakistan while China wants to project power along its trade routes and regional interests.<\/p>\n<p>Just 20 aircraft carriers are active throughout the world and the U.S. Navy operates 10 of them. For many military analysts, however, the value of a carrier lies in having one rather than ever using one.<\/p>\n<p>Ashley Townshend, analyst with the Lowy Institute for International Policy, says there is a disconnect between what an aircraft carrier projects and what it can actually do.<\/p>\n<p>\"Needing an aircraft carrier and wanting one are two different things,\" Townshend told CNN, adding that Asia -- despite recent headlines -- has had a long history of aircraft carrier operation.<\/p>\n<p>\"India has operated carriers before; China hasn't but China is a new foray into carrier naval warfare\/carrier naval operations,\" he said. \"Japan interestingly had the world's first aircraft carrier.\"<\/p>\n<p><strong>More image than action?<\/strong><\/p>\n<p class=\"cnn_storypgraphtxt cnn_storypgraph6\">The carrier race comes amid rising assertiveness of Asian's military powers and changing conditions in the region.<\/p>\n<p>For Japan, it's a counter to the rising power of China and the threat from North Korea. For India, its carrier flexes its muscle in the direction of Pakistan while China wants to project power along its trade routes and regional interests.<\/p>\n<p>Just 20 aircraft carriers are active throughout the world and the U.S. Navy operates 10 of them. For many military analysts, however, the value of a carrier lies in having one rather than ever using one.<\/p>\n<p>Ashley Townshend, analyst with the Lowy Institute for International Policy, says there is a disconnect between what an aircraft carrier projects and what it can actually do.<\/p>\n<p>\"Needing an aircraft carrier and wanting one are two different things,\" Townshend told CNN, adding that Asia -- despite recent headlines -- has had a long history of aircraft carrier operation.<\/p>\n<p>\"India has operated carriers before; China hasn't but China is a new foray into carrier naval warfare\/carrier naval operations,\" he said. \"Japan interestingly had the world's first aircraft carrier.\"<\/p>\n<p><strong>&nbsp;<\/strong><\/p>",
      "block": "1",
      "controller": "",
      "descript": "Text",
      "id": "5eeef22e-9887-f401-25e8-8de036ec5f51"
    }
  ],
  "dir": "\/sevices\/",
  "map": false,
  "metadesctiption": "",
  "metakeywords": "",
  "metatitle": "",
  "mtime": ISODate("2013-10-03T06:59:58.955Z"),
  "name": "Sevices",
  "parents": [
    ObjectId("524825755e2bda6409000001")
  ],
  "pid": ObjectId("524825755e2bda6409000001"),
  "tpl": ObjectId("524c4d8a7fc7804269000002")
},function(){});
db.collection("pages").insert({
  "_id": ObjectId("524833b7e5c5097736000003"),
  "access": false,
  "alias": "about",
  "blocks": [
    {
      "text": "<p><strong>More image than action?<\/strong><\/p>\n<p class=\"cnn_storypgraphtxt cnn_storypgraph6\">The carrier race comes amid rising assertiveness of Asian's military powers and changing conditions in the region.<\/p>\n<p>For Japan, it's a counter to the rising power of China and the threat from North Korea. For India, its carrier flexes its muscle in the direction of Pakistan while China wants to project power along its trade routes and regional interests.<\/p>\n<p>Just 20 aircraft carriers are active throughout the world and the U.S. Navy operates 10 of them. For many military analysts, however, the value of a carrier lies in having one rather than ever using one.<\/p>\n<p>Ashley Townshend, analyst with the Lowy Institute for International Policy, says there is a disconnect between what an aircraft carrier projects and what it can actually do.<\/p>\n<p>\"Needing an aircraft carrier and wanting one are two different things,\" Townshend told CNN, adding that Asia -- despite recent headlines -- has had a long history of aircraft carrier operation.<\/p>\n<p>\"India has operated carriers before; China hasn't but China is a new foray into carrier naval warfare\/carrier naval operations,\" he said. \"Japan interestingly had the world's first aircraft carrier.\"<\/p>",
      "block": "1",
      "controller": "",
      "descript": "Text",
      "id": "c3689c63-96dc-7fc0-8627-616aed3166ac"
    }
  ],
  "dir": "\/about\/",
  "map": false,
  "metadesctiption": "",
  "metakeywords": "",
  "metatitle": "",
  "mtime": ISODate("2013-10-03T07:01:14.231Z"),
  "name": "About Us",
  "parents": [
    ObjectId("524825755e2bda6409000001")
  ],
  "pid": ObjectId("524825755e2bda6409000001"),
  "tpl": ObjectId("524c4d8a7fc7804269000002")
},function(){});
db.collection("pages").insert({
  "_id": ObjectId("524c4fe791db4c8d6e000004"),
  "access": false,
  "alias": "downloads",
  "blocks": [
    {
      "text": "<p><strong>More image than action?<\/strong><\/p>\n<p class=\"cnn_storypgraphtxt cnn_storypgraph6\">The carrier race comes amid rising assertiveness of Asian's military powers and changing conditions in the region.<\/p>\n<p>For Japan, it's a counter to the rising power of China and the threat from North Korea. For India, its carrier flexes its muscle in the direction of Pakistan while China wants to project power along its trade routes and regional interests.<\/p>\n<p>Just 20 aircraft carriers are active throughout the world and the U.S. Navy operates 10 of them. For many military analysts, however, the value of a carrier lies in having one rather than ever using one.<\/p>\n<p>Ashley Townshend, analyst with the Lowy Institute for International Policy, says there is a disconnect between what an aircraft carrier projects and what it can actually do.<\/p>\n<p>\"Needing an aircraft carrier and wanting one are two different things,\" Townshend told CNN, adding that Asia -- despite recent headlines -- has had a long history of aircraft carrier operation.<\/p>\n<p>\"India has operated carriers before; China hasn't but China is a new foray into carrier naval warfare\/carrier naval operations,\" he said. \"Japan interestingly had the world's first aircraft carrier.\"<\/p>",
      "block": "1",
      "controller": "",
      "descript": "Text",
      "id": "6df27fa3-cfd2-d166-e612-87b1e7fe5402"
    }
  ],
  "dir": "\/downloads\/",
  "map": false,
  "metadesctiption": "",
  "metakeywords": "",
  "metatitle": "",
  "mtime": ISODate("2013-10-03T07:01:23.454Z"),
  "name": "Downloads",
  "parents": [
    ObjectId("524825755e2bda6409000001")
  ],
  "pid": ObjectId("524825755e2bda6409000001"),
  "tpl": ObjectId("524c4d8a7fc7804269000002")
},function(){});
db.collection("pages").insert({
  "_id": ObjectId("524c501891db4c8d6e000008"),
  "access": false,
  "alias": "contacts",
  "blocks": [
    {
      "text": "<p><strong>More image than action?<\/strong><\/p>\n<p class=\"cnn_storypgraphtxt cnn_storypgraph6\">The carrier race comes amid rising assertiveness of Asian's military powers and changing conditions in the region.<\/p>\n<p>For Japan, it's a counter to the rising power of China and the threat from North Korea. For India, its carrier flexes its muscle in the direction of Pakistan while China wants to project power along its trade routes and regional interests.<\/p>\n<p>Just 20 aircraft carriers are active throughout the world and the U.S. Navy operates 10 of them. For many military analysts, however, the value of a carrier lies in having one rather than ever using one.<\/p>\n<p>Ashley Townshend, analyst with the Lowy Institute for International Policy, says there is a disconnect between what an aircraft carrier projects and what it can actually do.<\/p>\n<p>\"Needing an aircraft carrier and wanting one are two different things,\" Townshend told CNN, adding that Asia -- despite recent headlines -- has had a long history of aircraft carrier operation.<\/p>\n<p>\"India has operated carriers before; China hasn't but China is a new foray into carrier naval warfare\/carrier naval operations,\" he said. \"Japan interestingly had the world's first aircraft carrier.\"<\/p>",
      "block": "1",
      "controller": "",
      "descript": "Text",
      "id": "1c1117a5-78f7-1d2f-f229-33262341e223"
    }
  ],
  "dir": "\/contacts\/",
  "map": false,
  "metadesctiption": "",
  "metakeywords": "",
  "metatitle": "",
  "mtime": ISODate("2013-10-03T07:01:41.105Z"),
  "name": "Contacts",
  "parents": [
    ObjectId("524825755e2bda6409000001")
  ],
  "pid": ObjectId("524825755e2bda6409000001"),
  "tpl": ObjectId("524c4d8a7fc7804269000002")
},function(){});
db.collection("pages").insert({
  "_id": ObjectId("524d77f25ee8bcbd1f000003"),
  "access": false,
  "alias": "news",
  "blocks": [
    {
      "text": "",
      "block": "1",
      "controller": "default:html:news-NewsModel",
      "descript": "Text",
      "id": "b1068899-accc-5a2a-432f-fdbcc4d5b18c"
    }
  ],
  "dir": "\/news\/",
  "map": false,
  "metadesctiption": "",
  "metakeywords": "",
  "metatitle": "",
  "mtime": ISODate("2013-10-03T13:58:32.694Z"),
  "name": "News",
  "parents": [
    ObjectId("524825755e2bda6409000001")
  ],
  "pid": ObjectId("524825755e2bda6409000001"),
  "tpl": ObjectId("524c4d8a7fc7804269000002")
},function(){});

/** system.indexes records **/
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "_id": 1
  },
  "ns": "test1db.admin_users",
  "name": "_id_"
},function(){});
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "_id": 1
  },
  "ns": "test1db.groups",
  "name": "_id_"
},function(){});
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "name": 1
  },
  "ns": "test1db.groups",
  "name": "name_1"
},function(){});
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "_id": 1
  },
  "ns": "test1db.pages",
  "name": "_id_"
},function(){});
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "_id": 1
  },
  "ns": "test1db.logs",
  "name": "_id_"
},function(){});
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "_id": 1
  },
  "ns": "test1db.admin_templates",
  "name": "_id_"
},function(){});
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "_id": 1
  },
  "ns": "test1db.mainmenu",
  "name": "_id_"
},function(){});
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "_id": 1
  },
  "ns": "test1db.news",
  "name": "_id_"
},function(){});
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "title": 1
  },
  "ns": "test1db.news",
  "name": "title_1"
},function(){});
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "datepubl": 1
  },
  "ns": "test1db.news",
  "name": "datepubl_1"
},function(){});
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "dateunpubl": 1
  },
  "ns": "test1db.news",
  "name": "dateunpubl_1"
},function(){});
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "ontop": 1
  },
  "ns": "test1db.news",
  "name": "ontop_1"
},function(){});
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "descript": 1
  },
  "ns": "test1db.news",
  "name": "descript_1"
},function(){});
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "date": 1
  },
  "ns": "test1db.logs",
  "name": "date_1"
},function(){});
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "model": 1
  },
  "ns": "test1db.logs",
  "name": "model_1"
},function(){});
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "actionType": 1
  },
  "ns": "test1db.logs",
  "name": "actionType_1"
},function(){});
db.collection("system.indexes").insert({
  "v": 1,
  "key": {
    "user": 1
  },
  "ns": "test1db.logs",
  "name": "user_1"
},function(){});
}
