import React from 'react';

function Visualizacao({ selecionados = [], nomeAluno = '', voltar = () => {}, editarReps = () => {} }) {
  const gerarHTML = () => {
    const conteudo = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Treino-${nomeAluno||'Aluno'}</title><style>body{font-family:Arial,Helvetica,sans-serif;background:#f9fafb;margin:0;padding:20px;color:#111}h2{text-align:center} .ex{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;background:#fff;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 2px 6px rgba(0,0,0,0.06)}.info{flex:1;min-width:200px}.info h3{margin:0}.reps{color:#555;margin-top:6px}.numero{background:#e0e7ff;color:#4338ca;border-radius:50%;display:inline-flex;width:32px;height:32px;align-items:center;justify-content:center;font-weight:700;margin-right:12px}img{width:150px;height:150px;object-fit:contain;border-radius:8px}@media(max-width:600px){.ex{flex-direction:column;text-align:center}img{width:200px;height:auto;margin-top:10px}}footer{text-align:center;margin-top:30px;color:#666}</style></head><body><h2>Treino de ${nomeAluno||'Aluno'}</h2>`
    + selecionados.map((ex,i)=>`<div class="ex"><div class="info"><div class="numero">${i+1}</div><h3>${ex.nome}</h3><div class="reps">${ex.reps||'3x10 rep'}</div></div><img src="./gifs/${encodeURIComponent(ex.grupo)}/${encodeURIComponent(ex.file)}" alt="${ex.nome}"/></div>`).join('') +
    `<footer>Treino by Rodolfo Ferraz</footer></body></html>`;
    const blob = new Blob([conteudo],{type:'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Treino-${nomeAluno||'Aluno'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-6">
        <h2 className="text-3xl font-bold text-center mb-2">Treino de {nomeAluno||'Aluno'}</h2>
        <div className="flex flex-col gap-4">
          {selecionados.map((ex,idx)=>(
            <div key={ex.id||idx} className="flex flex-wrap items-center justify-between border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold">{idx+1}</div>
                <div>
                  <div className="font-semibold text-gray-800">{ex.nome}</div>
                  <input type="text" value={ex.reps||'3x10 rep'} onChange={(e)=>editarReps(idx,e.target.value)} className="border border-gray-300 rounded-md px-2 py-1 w-24 mt-1 text-center text-sm" />
                </div>
              </div>
              <img src={`/gifs/${ex.grupo}/${ex.file}`} alt={ex.nome} className="w-32 h-32 object-contain rounded-md mt-3 sm:mt-0" />
            </div>
          ))}
        </div>
        <div className="text-center mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={voltar} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium">Voltar à seleção</button>
          <button onClick={gerarHTML} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium">Exportar Treino (HTML)</button>
        </div>
        <footer className="text-center text-gray-400 mt-8">Treino by Rodolfo Ferraz</footer>
      </div>
    </div>
  );
}

export default Visualizacao;
