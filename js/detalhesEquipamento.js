// ============================================
// HISTÓRICO DE MANUTENÇÕES
// ============================================


async function carregarHistorico(idEquipamento){



    try{
    
    
    
    const referencia = collection(
    
    
    db,
    
    
    "equipamentos",
    
    
    idEquipamento,
    
    
    "manutencoes"
    
    
    );
    
    
    
    
    
    const resultado = await getDocs(
        referencia
    );
    
    
    
    
    
    const tabela = document.getElementById(
    "listaManutencoes"
    );
    
    
    
    
    
    tabela.innerHTML = "";
    
    
    
    
    
    
    if(resultado.empty){
    
    
    
    tabela.innerHTML = `
    
    
    <tr>
    
    <td colspan="4">
    
    Nenhuma manutenção registrada.
    
    </td>
    
    
    </tr>
    
    
    `;
    
    return;
    
    
    }
    
    
    
    
    
    
    
    resultado.forEach((registro)=>{
    
    
    
    const manutencao = registro.data();
    
    
    
    
    tabela.innerHTML += `
    
    
    <tr>
    
    
    
    <td>
    
    ${manutencao.data || "-"}
    
    </td>
    
    
    
    <td>
    
    ${manutencao.tipo || "-"}
    
    </td>
    
    
    
    <td>
    
    ${manutencao.tecnico || "-"}
    
    </td>
    
    
    
    <td>
    
    
    <span class="status concluido">
    
    ${manutencao.status || "Concluído"}
    
    </span>
    
    
    
    </td>
    
    
    
    </tr>
    
    
    `;
    
    
    
    });
    
    
    
    }
    
    
    catch(error){
    
    
    console.error(
    
    "Erro ao carregar histórico:",
    
    error
    
    );
    
    
    
    }
    
    
    
    }