// 本週情境庫 — 由 Claude Code 每週產生，App 以 <script> 載入
// Week 1: 2026-W27 (2026-06-29 ~ 2026-07-05) — 程度定位 A2-B1，difficulty 1-2
window.WEEK_DATA = {
  week: "2026-W27",
  scenarios: [
    // ===== MEDICAL =====
    {
      id: "med-2026w27-01",
      theme: "medical",
      title: "Presenting a patient at morning rounds",
      titleZh: "晨會報告病人",
      difficulty: 1,
      grammarFocus: ["past-simple"],
      phraseCards: [
        { en: "This is a 60-year-old man with chest pain.", zh: "這是一位 60 歲、胸痛的男性病人。" },
        { en: "He came to the emergency room last night.", zh: "他昨晚來到急診室。" },
        { en: "His vital signs are stable now.", zh: "他現在生命徵象穩定。" }
      ],
      turns: [
        {
          coach: "Good morning. Can you tell me about your patient?",
          coachZh: "早安，可以跟我說說你的病人嗎？",
          expected: {
            modelAnswer: "This is a 60-year-old man. He came in with chest pain last night.",
            starter: "This is a ...",
            mustInclude: ["chest pain"],
            keywords: ["year-old", "last night", "came"],
            grammar: "past-simple"
          }
        },
        {
          coach: "I see. What did you do for him?",
          coachZh: "了解。你們為他做了什麼處置？",
          expected: {
            modelAnswer: "We gave him oxygen and checked his ECG. We also took a blood test.",
            starter: "We gave him ...",
            mustInclude: ["we gave"],
            keywords: ["oxygen", "ecg", "blood test"],
            grammar: "past-simple"
          }
        },
        {
          coach: "Good. How is he doing now?",
          coachZh: "很好。他現在狀況如何？",
          expected: {
            modelAnswer: "He is stable now. His pain is better and his vital signs are normal.",
            starter: "He is ...",
            mustInclude: ["stable"],
            keywords: ["pain", "vital signs", "better"],
            grammar: "present-simple"
          }
        }
      ]
    },
    {
      id: "med-2026w27-02",
      theme: "medical",
      title: "Talking to a patient before anesthesia",
      titleZh: "麻醉前訪視病人",
      difficulty: 1,
      grammarFocus: ["future-will", "present-simple"],
      phraseCards: [
        { en: "I am your anesthesiologist for tomorrow.", zh: "我是您明天的麻醉科醫師。" },
        { en: "You will sleep during the whole surgery.", zh: "整個手術過程中您都會睡著。" },
        { en: "Please do not eat or drink after midnight.", zh: "午夜之後請不要進食或喝水。" }
      ],
      turns: [
        {
          coach: "Hello doctor. I'm very nervous about my surgery tomorrow.",
          coachZh: "醫師您好，我對明天的手術很緊張。",
          expected: {
            modelAnswer: "Don't worry. I am your anesthesiologist. I will take care of you during the surgery.",
            starter: "Don't worry. I am ...",
            mustInclude: ["i will"],
            keywords: ["anesthesiologist", "take care", "surgery"],
            grammar: "future-will"
          }
        },
        {
          coach: "Will I feel any pain during the operation?",
          coachZh: "手術中我會感覺到痛嗎？",
          expected: {
            modelAnswer: "No, you will not feel any pain. You will sleep during the whole surgery.",
            starter: "No, you will not ...",
            mustInclude: ["you will"],
            keywords: ["pain", "sleep", "surgery"],
            grammar: "future-will"
          }
        },
        {
          coach: "Is there anything I need to do before the surgery?",
          coachZh: "手術前我需要做什麼準備嗎？",
          expected: {
            modelAnswer: "Yes. Please do not eat or drink after midnight. This keeps you safe during anesthesia.",
            starter: "Yes. Please do not ...",
            mustInclude: ["do not eat"],
            keywords: ["drink", "midnight", "safe"],
            grammar: "present-simple"
          }
        }
      ]
    },
    {
      id: "med-2026w27-03",
      theme: "medical",
      title: "Answering a question after your talk",
      titleZh: "報告後回答提問",
      difficulty: 2,
      grammarFocus: ["present-perfect", "modal-would"],
      phraseCards: [
        { en: "That is a good question.", zh: "這是個好問題。" },
        { en: "We have used this method for two years.", zh: "我們使用這個方法已經兩年了。" },
        { en: "I would say the main benefit is safety.", zh: "我會說最主要的好處是安全性。" }
      ],
      turns: [
        {
          coach: "Thank you for your talk. How long have you used this technique in your hospital?",
          coachZh: "謝謝你的報告。你們醫院使用這個技術多久了？",
          expected: {
            modelAnswer: "That is a good question. We have used this technique for about two years.",
            starter: "That is a good question. We have ...",
            mustInclude: ["we have used"],
            keywords: ["technique", "two years", "hospital"],
            grammar: "present-perfect"
          }
        },
        {
          coach: "And what is the main benefit for your patients?",
          coachZh: "那對病人最主要的好處是什麼？",
          expected: {
            modelAnswer: "I would say the main benefit is safety. Patients also recover faster.",
            starter: "I would say ...",
            mustInclude: ["i would say"],
            keywords: ["benefit", "safety", "recover"],
            grammar: "modal-would"
          }
        },
        {
          coach: "Interesting. Have you had any problems with it?",
          coachZh: "有意思。使用上有遇到什麼問題嗎？",
          expected: {
            modelAnswer: "We have had a few small problems, but nothing serious. Good training is very important.",
            starter: "We have had ...",
            mustInclude: ["we have had"],
            keywords: ["problems", "serious", "training"],
            grammar: "present-perfect"
          }
        }
      ]
    },
    // ===== SMALL TALK =====
    {
      id: "talk-2026w27-01",
      theme: "smalltalk",
      title: "Coffee break at a conference",
      titleZh: "研討會的茶敘時間",
      difficulty: 1,
      grammarFocus: ["present-simple"],
      phraseCards: [
        { en: "Nice to meet you. I'm from Taiwan.", zh: "很高興認識你，我來自台灣。" },
        { en: "I work as an anesthesiologist.", zh: "我的工作是麻醉科醫師。" },
        { en: "Is this your first time at this conference?", zh: "這是你第一次參加這個研討會嗎？" }
      ],
      turns: [
        {
          coach: "Hi there! I don't think we've met. I'm Sarah, from Dublin.",
          coachZh: "嗨！我們好像還沒見過，我是 Sarah，來自都柏林。",
          expected: {
            modelAnswer: "Nice to meet you, Sarah. I'm Ting-Wei, from Taiwan.",
            starter: "Nice to meet you ...",
            mustInclude: ["nice to meet you"],
            keywords: ["taiwan", "i'm"],
            grammar: "present-simple"
          }
        },
        {
          coach: "Taiwan, how lovely! What do you do there?",
          coachZh: "台灣，真好！你在那邊做什麼工作？",
          expected: {
            modelAnswer: "I work as an anesthesiologist in a hospital in Changhua.",
            starter: "I work as ...",
            mustInclude: ["i work as"],
            keywords: ["anesthesiologist", "hospital"],
            grammar: "present-simple"
          }
        },
        {
          coach: "That sounds like hard work! Are you enjoying the conference so far?",
          coachZh: "聽起來是辛苦的工作！目前為止研討會還喜歡嗎？",
          expected: {
            modelAnswer: "Yes, I like it a lot. The talks are very interesting. How about you?",
            starter: "Yes, I like ...",
            mustInclude: ["how about you"],
            keywords: ["interesting", "talks", "like"],
            grammar: "present-simple"
          }
        }
      ]
    },
    {
      id: "talk-2026w27-02",
      theme: "smalltalk",
      title: "Talking about your weekend",
      titleZh: "聊聊週末做了什麼",
      difficulty: 1,
      grammarFocus: ["past-simple"],
      phraseCards: [
        { en: "I had a relaxing weekend.", zh: "我度過了一個放鬆的週末。" },
        { en: "I went hiking with my family.", zh: "我和家人去爬山。" },
        { en: "The weather was really nice.", zh: "天氣真的很好。" }
      ],
      turns: [
        {
          coach: "Morning! How was your weekend?",
          coachZh: "早安！週末過得如何？",
          expected: {
            modelAnswer: "It was great, thanks. I went hiking with my family on Saturday.",
            starter: "It was ...",
            mustInclude: ["it was"],
            keywords: ["weekend", "family", "went"],
            grammar: "past-simple"
          }
        },
        {
          coach: "Oh nice! Where did you go?",
          coachZh: "真好！你們去了哪裡？",
          expected: {
            modelAnswer: "We went to a small mountain near our home. The weather was really nice.",
            starter: "We went to ...",
            mustInclude: ["we went"],
            keywords: ["mountain", "weather", "nice"],
            grammar: "past-simple"
          }
        },
        {
          coach: "Sounds lovely. Did you do anything else?",
          coachZh: "聽起來很棒。還有做別的事嗎？",
          expected: {
            modelAnswer: "Yes, we had dinner at a nice restaurant. And how was your weekend?",
            starter: "Yes, we had ...",
            mustInclude: ["how was your"],
            keywords: ["dinner", "restaurant"],
            grammar: "past-simple"
          }
        }
      ]
    },
    {
      id: "talk-2026w27-03",
      theme: "smalltalk",
      title: "Telling people about Taiwan",
      titleZh: "向外國人介紹台灣",
      difficulty: 2,
      grammarFocus: ["comparative", "present-simple"],
      phraseCards: [
        { en: "Taiwan is famous for its night markets.", zh: "台灣以夜市聞名。" },
        { en: "Summer in Taiwan is much hotter than here.", zh: "台灣的夏天比這裡熱得多。" },
        { en: "You should try the street food.", zh: "你應該試試街頭小吃。" }
      ],
      turns: [
        {
          coach: "I've never been to Taiwan. What is it like?",
          coachZh: "我從來沒去過台灣，那裡是什麼樣子？",
          expected: {
            modelAnswer: "Taiwan is a beautiful island. It is famous for its food and night markets.",
            starter: "Taiwan is ...",
            mustInclude: ["famous for"],
            keywords: ["island", "food", "night markets"],
            grammar: "present-simple"
          }
        },
        {
          coach: "Night markets? Tell me more!",
          coachZh: "夜市？多說一點！",
          expected: {
            modelAnswer: "Night markets are open in the evening. You can eat many kinds of street food there. It is cheaper than a restaurant.",
            starter: "Night markets are ...",
            mustInclude: ["cheaper than"],
            keywords: ["evening", "street food", "eat"],
            grammar: "comparative"
          }
        },
        {
          coach: "How is the weather there compared to Ireland?",
          coachZh: "那邊的天氣跟愛爾蘭比起來如何？",
          expected: {
            modelAnswer: "Taiwan is much hotter than Ireland, especially in summer. It is also more humid.",
            starter: "Taiwan is much ...",
            mustInclude: ["hotter than"],
            keywords: ["summer", "humid", "weather"],
            grammar: "comparative"
          }
        }
      ]
    },
    // ===== TRAVEL =====
    {
      id: "trav-2026w27-01",
      theme: "travel",
      title: "Checking in at a hotel",
      titleZh: "飯店辦理入住",
      difficulty: 1,
      grammarFocus: ["present-simple"],
      phraseCards: [
        { en: "I have a reservation under Liang.", zh: "我有一個以 Liang 為名的訂房。" },
        { en: "What time is breakfast?", zh: "早餐是幾點？" },
        { en: "Could I have a quiet room, please?", zh: "可以給我安靜一點的房間嗎？" }
      ],
      turns: [
        {
          coach: "Good evening! Welcome to the Grand Hotel. How can I help you?",
          coachZh: "晚安！歡迎來到 Grand Hotel，需要什麼服務嗎？",
          expected: {
            modelAnswer: "Good evening. I have a reservation under Liang. L-I-A-N-G.",
            starter: "Good evening. I have a ...",
            mustInclude: ["i have a reservation"],
            keywords: ["under", "liang"],
            grammar: "present-simple"
          }
        },
        {
          coach: "Let me check... yes, here it is. Three nights, is that right?",
          coachZh: "我查一下……有的，在這裡。住三晚，對嗎？",
          expected: {
            modelAnswer: "Yes, that's right. Three nights. Could I have a quiet room, please?",
            starter: "Yes, that's right ...",
            mustInclude: ["could i have"],
            keywords: ["three nights", "quiet room"],
            grammar: "modal-would"
          }
        },
        {
          coach: "Of course. Here is your key card, room 502. Is there anything else?",
          coachZh: "當然可以。這是您的房卡，502 號房。還需要什麼嗎？",
          expected: {
            modelAnswer: "Thank you. One more question, what time is breakfast?",
            starter: "Thank you. One more question ...",
            mustInclude: ["what time"],
            keywords: ["breakfast", "thank you"],
            grammar: "present-simple"
          }
        }
      ]
    },
    {
      id: "trav-2026w27-02",
      theme: "travel",
      title: "Ordering food at a restaurant",
      titleZh: "餐廳點餐",
      difficulty: 1,
      grammarFocus: ["modal-would"],
      phraseCards: [
        { en: "I would like the fish and chips, please.", zh: "我想要點炸魚薯條，謝謝。" },
        { en: "What do you recommend?", zh: "你推薦什麼？" },
        { en: "Could we have the bill, please?", zh: "可以幫我們結帳嗎？" }
      ],
      turns: [
        {
          coach: "Hi, are you ready to order?",
          coachZh: "您好，準備好點餐了嗎？",
          expected: {
            modelAnswer: "Almost. What do you recommend? Is the fish good here?",
            starter: "Almost. What do you ...",
            mustInclude: ["what do you recommend"],
            keywords: ["fish", "good"],
            grammar: "present-simple"
          }
        },
        {
          coach: "The fish and chips is our most popular dish. Very fresh!",
          coachZh: "炸魚薯條是我們最受歡迎的餐點，非常新鮮！",
          expected: {
            modelAnswer: "Great. I would like the fish and chips, please. And a glass of water.",
            starter: "Great. I would like ...",
            mustInclude: ["i would like"],
            keywords: ["fish and chips", "water", "please"],
            grammar: "modal-would"
          }
        },
        {
          coach: "Excellent choice. Anything for dessert?",
          coachZh: "好選擇。要來點甜點嗎？",
          expected: {
            modelAnswer: "No, thank you. Just the fish and chips. Could we have the bill after the meal?",
            starter: "No, thank you. Just ...",
            mustInclude: ["could we have"],
            keywords: ["bill", "thank you", "meal"],
            grammar: "modal-would"
          }
        }
      ]
    },
    {
      id: "trav-2026w27-03",
      theme: "travel",
      title: "Taking a taxi in Dublin",
      titleZh: "在都柏林搭計程車",
      difficulty: 2,
      grammarFocus: ["future-will", "present-simple"],
      phraseCards: [
        { en: "Could you take me to the convention centre, please?", zh: "可以載我到會議中心嗎？" },
        { en: "How long will it take?", zh: "大概要多久？" },
        { en: "Could I pay by card?", zh: "可以刷卡付款嗎？" }
      ],
      turns: [
        {
          coach: "Where to, love?",
          coachZh: "要去哪裡呢？（愛爾蘭司機常用 love 稱呼客人）",
          expected: {
            modelAnswer: "Could you take me to the Convention Centre Dublin, please?",
            starter: "Could you take me to ...",
            mustInclude: ["could you take me"],
            keywords: ["convention centre", "please"],
            grammar: "modal-would"
          }
        },
        {
          coach: "No problem at all. Hop in! First time in Dublin?",
          coachZh: "沒問題，上車吧！第一次來都柏林嗎？",
          expected: {
            modelAnswer: "Yes, it's my first time. I'm here for a medical conference. How long will it take?",
            starter: "Yes, it's my first time ...",
            mustInclude: ["how long will it take"],
            keywords: ["first time", "conference"],
            grammar: "future-will"
          }
        },
        {
          coach: "About twenty minutes if the traffic is good. Here we are! That'll be eighteen euros.",
          coachZh: "路況好的話大概二十分鐘。到囉！一共十八歐元。",
          expected: {
            modelAnswer: "Thank you very much. Could I pay by card?",
            starter: "Thank you very much. Could I ...",
            mustInclude: ["pay by card"],
            keywords: ["thank you", "could"],
            grammar: "modal-would"
          }
        }
      ]
    }
  ]
};
