'use strict';
const questions = [
 {text:'Um mercado anuncia uma promoção de 40% de desconto em determinado produto. Qual informação é mais importante verificar antes de considerar a oferta vantajosa?',options:['A posição do produto nas prateleiras.','O preço praticado antes da promoção e os valores em outros estabelecimentos.','A quantidade de produtos disponíveis no estoque.','A popularidade da marca entre os consumidores.','O número de clientes que compram o produto.'],correct:1},
 {text:'Dois mercados oferecem o mesmo produto por preços diferentes, mas um deles apresenta um valor promocional condicionado a uma forma específica de pagamento. Qual é a melhor decisão?',options:['Escolher automaticamente o menor preço anunciado.','Considerar apenas o preço informado na etiqueta.','Verificar as condições da oferta e comparar o custo efetivo da compra.','Priorizar o estabelecimento que anuncia mais promoções.','Escolher o mercado que oferece maior variedade de produtos.'],correct:2},
 {text:'Uma promoção pode não representar uma vantagem real para o consumidor quando:',options:['O produto está disponível em diferentes estabelecimentos.','O estabelecimento oferece diferentes formas de pagamento.','O preço promocional é semelhante ao preço normalmente praticado em outros mercados.','O produto pertence a uma marca conhecida.','O estabelecimento possui um estoque limitado.'],correct:2},
 {text:'Qual atitude representa melhor o conceito de consumo consciente?',options:['Comprar sempre os produtos com os menores preços.','Priorizar marcas conhecidas, independentemente do valor.','Aproveitar todas as promoções disponíveis.','Avaliar preço, qualidade, necessidade e condições de compra.','Concentrar todas as compras em um único estabelecimento.'],correct:3},
 {text:'Por que comparar preços entre pequenos mercados e grandes redes pode ser vantajoso para o consumidor?',options:['Porque grandes redes sempre possuem os menores preços.','Porque pequenos estabelecimentos trabalham exclusivamente com produtos mais baratos.','Porque permite identificar oportunidades competitivas, independentemente do tamanho do estabelecimento.','Porque os preços dos pequenos mercados são sempre mais estáveis.','Porque comparar preços elimina a necessidade de avaliar a qualidade dos produtos.'],correct:2}
];
const LIMIT = 30;
const $ = id => document.getElementById(id);
let current = 0, selected = null, responses = [], interval = null, deadline = 0, locked = false;
function show(id){for(const screen of ['home','quiz','result']) $(screen).hidden = screen !== id; window.scrollTo(0,0);}
function stopTimer(){clearInterval(interval); interval=null;}
function start(){stopTimer();current=0;responses=[];show('quiz');renderQuestion();}
function renderQuestion(){
 stopTimer(); selected=null;locked=false;
 const q=questions[current];const progress=(current+1)/questions.length*100;
 $('position').textContent=`Pergunta ${current+1} de ${questions.length}`;
 $('percent').textContent=`${progress}%`;$('bar').style.width=`${progress}%`;$('progress').setAttribute('aria-valuenow',progress);
 $('question').textContent=q.text;$('answers').replaceChildren();$('feedback').textContent='';$('next').disabled=true;
 $('next').textContent=current===questions.length-1?'Ver resultado →':'Próxima →';
 q.options.forEach((option,i)=>{
  const button=document.createElement('button');button.type='button';button.className='answer';button.setAttribute('aria-pressed','false');
  const letter=document.createElement('span');letter.className='letter';letter.textContent='ABCDE'[i];
  const label=document.createElement('span');label.textContent=option;button.append(letter,label);
  button.addEventListener('click',()=>{if(locked)return;if(Date.now()>=deadline){advance(true);return;}selected=i;[...$('answers').children].forEach((b,j)=>{b.classList.toggle('selected',j===i);b.setAttribute('aria-pressed',String(j===i));});$('next').disabled=false;});
  $('answers').append(button);
 });
 deadline=Date.now()+LIMIT*1000;tick();interval=setInterval(tick,100);$('question').focus({preventScroll:true});
}
function tick(){if(locked)return;const remaining=Math.max(0,deadline-Date.now());const sec=Math.ceil(remaining/1000);$('seconds').textContent=sec;$('timer').style.setProperty('--remaining',`${remaining/(LIMIT*1000)*100}%`);$('timer').classList.toggle('urgent',sec<=10);if(remaining<=0)advance(true);}
function advance(timedOut=false){
 if(locked||(!timedOut&&selected===null))return;
 locked=true;stopTimer();responses.push({answer:selected,timedOut});$('next').disabled=true;[...$('answers').children].forEach(b=>b.disabled=true);
 current++;if(current>=questions.length){finish();}else{renderQuestion();if(timedOut)$('feedback').textContent='O tempo da pergunta anterior terminou.';}
}
function finish(){
 stopTimer();const hits=responses.filter((r,i)=>r.answer===questions[i].correct).length;const score=hits*20;
 const rank=score===100?'Mestre da Economia':score>=60?'Caçador de Ofertas':'Consumidor Iniciante';
 $('rank').textContent=rank;$('score').textContent=score;$('summary').textContent=`Você acertou ${hits} de ${questions.length} perguntas.`;
 $('message').textContent=score===100?'Parabéns! Você mostrou que sabe comprar de forma inteligente.':score>=60?'Muito bem! Continue comparando preços e aproveitando as melhores oportunidades.':'Continue aprendendo com o Precinho e descubra novas maneiras de economizar!';
 $('result-icon').src=`assets/${score===100?'visual_melhores_ofertas':score>=60?'visual_comparar_precos':'visual_dicas_precinho'}.png`;
 $('review').replaceChildren();$('result').querySelector('details').open=false;
 questions.forEach((q,i)=>{const r=responses[i];const item=document.createElement('div');item.className='review-item';const title=document.createElement('strong');title.textContent=`${i+1}. ${q.text}`;const answer=document.createElement('p');answer.className=r.answer===q.correct?'right':'wrong';answer.textContent=r.answer===null?'Sua resposta: não respondida':`Sua resposta: ${'ABCDE'[r.answer]}) ${q.options[r.answer]}`;const correct=document.createElement('p');correct.textContent=`Gabarito: ${'ABCDE'[q.correct]}) ${q.options[q.correct]}`;item.append(title,answer,correct);$('review').append(item);});show('result');
}
$('start').addEventListener('click',start);$('restart').addEventListener('click',start);$('next').addEventListener('click',()=>advance(Date.now()>=deadline));$('back').addEventListener('click',()=>{stopTimer();show('home');});
