import React, { useEffect, useState } from 'react';
import Visualizacao from './Visualizacao.jsx';

export default function App(){
  const [busca,setBusca]=useState('');
  const [gifsMap,setGifsMap]=useState({});
  const [resultados,setResultados]=useState([]);
  const [selecionados,setSelecionados]=useState([]);
  const [visualizando,setVisualizando]=useState(false);
  const [nomeAluno,setNomeAluno]=useState('');

  useEffect(()=>{
    fetch('/gifs.json').then(r=>{ if(!r.ok) throw new Error('gifs.json não encontrado'); return r.json() })
    .then(data=>setGifsMap(data)).catch(e=>{ console.error(e); setGifsMap({}) });
  },[]);

  useEffect(()=>{
    if(!busca.trim()){ setResultados([]); return; }
    const q=busca.toLowerCase();
    const out=[];
    Object.entries(gifsMap).forEach(([grupo,arquivos])=>{
      arquivos.forEach(arquivo=>{
        if(arquivo.toLowerCase().includes(q)){
          out.push({ key:`${grupo}::${arquivo}`, grupo, file:arquivo, nome: arquivo.replace(/\.gif$/i,'').replace(/_/g,' ') });
        }
      })
    });
    setResultados(out);
  },[busca,gifsMap]);

  const adicionar = (item)=>{
    const id=`${item.grupo}::${item.file}`;
    if(selecionados.find(s=>s.id===id)) return;
    const novo={ id, grupo:item.grupo, file:item.file, nome:item.nome, reps:'3x10 rep' };
    setSelecionados(p=>[...p,novo]);
  };

  const remover = (id)=> setSelecionados(p=>p.filter(s=>s.id!==id));
  const editarNome = (id,novo)=> setSelecionados(p=>p.map(s=>s.id===id?{...s,nome:novo}:s));
  const editarReps = (id,novo)=> setSelecionados(p=>p.map(s=>s.id===id?{...s,reps:novo}:s));
  const mover = (index,dir)=> setSelecionados(p=>{ const c=[...p]; const alvo = dir==='up'?index-1:index+1; if(alvo<0||alvo>=c.length) return c; [c[index],c[alvo]]=[c[alvo],c[index]]; return c });

  if(visualizando) return <Visualizacao selecionados={selecionados} nomeAluno={nomeAluno} voltar={()=>setVisualizando(false)} editarReps={(idx,val)=>{ const id=selecionados[idx]?.id; if(id) editarReps(id,val)}}/>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-6xl mx-auto text-center mb-8"><h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">Planner de Exercícios</h1></header>
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <label className="block text-sm font-medium text-gray-700">Buscar exercícios</label>
          <div className="mt-2 flex gap-2">
            <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Ex.: agachamento, rosca..." className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            <button onClick={()=>setBusca('')} className="px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm">Limpar</button>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-700">Resultados</h2>
            <p className="text-sm text-gray-400 mt-1">Digite para ver exercícios (nenhum GIF será mostrado antes de digitar).</p>
            {busca.trim()? (resultados.length? (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {resultados.map(ex=>(
                  <article key={ex.key} className="border border-gray-100 rounded-lg p-3 shadow-sm bg-white flex flex-col">
                    <div className="h-40 flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
                      <img src={`/gifs/${encodeURIComponent(ex.grupo)}/${encodeURIComponent(ex.file)}`} alt={ex.nome} className="max-h-full" />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800">{ex.nome}</h3>
                      <button onClick={()=>adicionar(ex)} className="px-3 py-1 rounded-md text-sm border bg-white text-gray-700 border-gray-200">Adicionar</button>
                    </div>
                  </article>
                ))}
              </div>
            ):(<p className="mt-4 text-sm text-gray-500">Nenhum exercício encontrado para "{busca}".</p>)):(<div className="mt-4 text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">Digite na busca para mostrar exercícios com GIFs.</div>)}
          </div>
        </section>
        <aside className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-medium text-gray-700">Treino Selecionado</h2>
          <p className="text-sm text-gray-400 mt-1">{selecionados.length} exercício(s)</p>
          <div className="mt-4">
            <input value={nomeAluno} onChange={e=>setNomeAluno(e.target.value)} placeholder="Nome do aluno" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <ul className="mt-4 space-y-3 max-h-72 overflow-auto">
            {selecionados.length? selecionados.map((s,idx)=>(
              <li key={s.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div className="flex items-center gap-3">
                  <img src={`/gifs/${encodeURIComponent(s.grupo)}/${encodeURIComponent(s.file)}`} alt={s.nome} className="w-12 h-12 object-cover rounded" />
                  <div className="text-sm">
                    <input value={s.nome} onChange={e=>editarNome(s.id,e.target.value)} className="border rounded px-2 py-1 text-sm" />
                    <div className="text-xs text-gray-500 mt-1">{s.grupo}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>mover(idx,'up')} className="text-sm px-2 py-1 rounded border">↑</button>
                  <button onClick={()=>mover(idx,'down')} className="text-sm px-2 py-1 rounded border">↓</button>
                  <button onClick={()=>remover(s.id)} className="text-sm px-2 py-1 rounded border bg-red-500 text-white">Remover</button>
                </div>
              </li>
            )):(<li className="text-sm text-gray-500">Nenhum exercício selecionado.</li>)}
          </ul>
          <div className="mt-6">
            <button onClick={()=>setVisualizando(true)} disabled={!selecionados.length} className={`w-full py-3 rounded-lg text-white font-medium ${selecionados.length?'bg-indigo-600 hover:bg-indigo-700':'bg-gray-300 cursor-not-allowed'}`}>Visualizar treino</button>
          </div>
        </aside>
      </main>
    </div>
  );
}
