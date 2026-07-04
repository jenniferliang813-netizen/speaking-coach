function cleanWord(w){ return w.toLowerCase().replace(/[.,!?;:'"]/g,""); }
function mergeWords(baseWords, addStr){
  var add=String(addStr||"").trim().split(/\s+/).filter(Boolean);
  if(!add.length) return baseWords;
  if(!baseWords.length) return add.slice();
  var baseLow=baseWords.map(cleanWord), addLow=add.map(cleanWord);
  var maxK=Math.min(baseWords.length,add.length),best=0;
  for(var k=maxK;k>=1;k--){var ok=true;for(var j=0;j<k;j++){if(baseLow[baseWords.length-k+j]!==addLow[j]){ok=false;break;}}if(ok){best=k;break;}}
  return baseWords.concat(add.slice(best));
}
function makeFlow(){
  var committedWords=[], confList=[], lastLive="";
  function onresult(event){
    var working=committedWords.slice();
    for(var i=event.resultIndex;i<event.results.length;i++){
      var res=event.results[i],alt=res[0];
      if(!alt) continue; var txt=(alt.transcript||"").trim(); if(!txt) continue;
      if(res.isFinal){ committedWords=mergeWords(committedWords,txt); if(typeof alt.confidence==="number"&&alt.confidence>0)confList.push(alt.confidence); working=committedWords.slice(); }
      else { working=mergeWords(working,txt); }
    }
    lastLive=working.join(" ").trim();
  }
  function deliver(){ var f=committedWords.length?committedWords.slice():(lastLive?lastLive.split(/\s+/).filter(Boolean):[]); return f.join(" ").trim(); }
  return {onresult,deliver};
}
function R(t,f,c){var r=[{transcript:t,confidence:c||0}];r.isFinal=f;return r;}
// 遞增 index 累積模式：每段是新 final，results 累積前面所有段，resultIndex 指向新段
function feedIncIndex(f, seq){ const results=[]; seq.forEach((t,i)=>{ results.push(R(t,true,0.9)); f.onresult({results:results.slice(), resultIndex:i}); }); }
// 同 index 覆蓋模式：results 永遠只有一個元素在 index 0，反覆覆蓋
function feedSameIndex(f, seq){ seq.forEach(t=>{ f.onresult({results:[R(t,true,0.9)], resultIndex:0}); }); }
let pass=0,fail=0;
function check(n,g,w){if(g===w){pass++;console.log("  PASS",n);}else{fail++;console.log("  FAIL",n,"\n    got :["+g+"]\n    want:["+w+"]");}}

const realSeq=["good","good evening","good evening welcome","good evening welcome to","good evening welcome to the","good evening welcome to the Grand","good evening welcome to the Grand Hotel","good evening welcome to the Grand Hotel how","good evening welcome to the Grand Hotel how can I help you"];
const want1="good evening welcome to the Grand Hotel how can I help you";

console.log("案例1a 實機逐字遞增(遞增index累積) → 單句");
{const f=makeFlow(); feedIncIndex(f,realSeq); check("結果",f.deliver(),want1);}
console.log("案例1b 實機逐字遞增(同index覆蓋) → 單句");
{const f=makeFlow(); feedSameIndex(f,realSeq); check("結果",f.deliver(),want1);}

console.log("案例3 [P1] 合法重複逐字重報 → 保留(遞增index)");
{const f=makeFlow(); feedIncIndex(f,["I","I will","I will I","I will I will","I will I will call","I will I will call the doctor"]); check("保留",f.deliver(),"I will I will call the doctor");}
console.log("案例4 [P1] 疊字逐字重報 → 保留(遞增index)");
{const f=makeFlow(); feedIncIndex(f,["very","very very","very very good"]); check("保留",f.deliver(),"very very good");}
console.log("案例4b [P1] 疊字(同index覆蓋) → 保留");
{const f=makeFlow(); feedSameIndex(f,["very","very very","very very good"]); check("保留",f.deliver(),"very very good");}

console.log("案例5 互斥增量(桌面) → 拼接");
{const f=makeFlow(); f.onresult({results:[R("could I have",true,0.8)],resultIndex:0}); f.onresult({results:[R("could I have",true,0.8),R("a quiet room",true,0.8)],resultIndex:1}); check("拼接",f.deliver(),"could I have a quiet room");}

console.log("案例6 [P3] interim錯字不污染數字");
{const f=makeFlow(); f.onresult({results:[R("the dose is fifteen",true,0.9)],resultIndex:0}); f.onresult({results:[R("the dose is fifteen",true,0.9),R("fifty milligrams",false)],resultIndex:1}); check("不污染",f.deliver(),"the dose is fifteen");}

console.log("案例7 放開太快只有interim → 兜底");
{const f=makeFlow(); f.onresult({results:[R("under Liang",false)],resultIndex:0}); check("兜底",f.deliver(),"under Liang");}

console.log("\n總計 pass="+pass+" fail="+fail);
process.exit(fail?1:0);
