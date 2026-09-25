// ============================================
// PMOC ENERGISA
// DETALHES DO EQUIPAMENTO
// ============================================

import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================
// ID DO EQUIPAMENTO
// ============================================

const parametros = new URLSearchParams(
    window.location.search
);

const idEquipamento = parametros.get("id");

console.log(
    "ID recebido pela URL:",
    idEquipamento
);


// ============================================
// ELEMENTOS HTML
// ============================================

const codigo =
    document.getElementById("codigo");

const unidade =
    document.getElementById("unidade");

const ambiente =
    document.getElementById("ambiente");

const marca =
    document.getElementById("marca");

const modelo =
    document.getElementById("modelo");

const capacidade =
    document.getElementById("capacidade");

const listaManutencoes =
    document.getElementById("listaManutencoes");

const botaoManutencao =
    document.getElementById("novaManutencao");

const botaoVoltar =
    document.getElementById("voltar");


// ============================================
// FUNÇÃO AUXILIAR
// ============================================

function preencher(elemento, valor){

    if(!elemento){
        return;
    }

    elemento.textContent =
        valor !== undefined &&
        valor !== null &&
        valor !== ""
            ? valor
            : "-";
}


// ============================================
// FORMATAR DATA
// ============================================

function formatarData(data){

    if(!data){
        return "-";
    }


    // Firestore Timestamp
    if(
        typeof data === "object" &&
        typeof data.toDate === "function"
    ){

        const dataConvertida =
            data.toDate();

        return dataConvertida.toLocaleDateString(
            "pt-BR"
        );
    }


    const texto =
        String(data);


    // yyyy-mm-dd
    if(
        /^\d{4}-\d{2}-\d{2}$/.test(texto)
    ){

        const partes =
            texto.split("-");

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }


    return texto;
}


// ============================================
// CARREGAR EQUIPAMENTO
// ============================================

async function carregarEquipamento(){

    try{

        if(!idEquipamento){

            console.error(
                "ID do equipamento não informado."
            );

            return;
        }


        const referencia =
            doc(
                db,
                "equipamentos",
                idEquipamento
            );


        const resultado =
            await getDoc(
                referencia
            );


        if(!resultado.exists()){

            console.error(
                "Equipamento não encontrado:",
                idEquipamento
            );

            preencher(
                codigo,
                idEquipamento
            );

            return;
        }


        const equipamento =
            resultado.data();


        console.log(
            "Equipamento encontrado:",
            equipamento
        );


        preencher(
            codigo,
            equipamento.codigo || idEquipamento
        );


        preencher(
            unidade,
            equipamento.unidade
        );


        preencher(
            ambiente,
            equipamento.ambiente
        );


        preencher(
            marca,
            equipamento.marca
        );


        preencher(
            modelo,
            equipamento.modelo
        );


        preencher(
            capacidade,
            equipamento.btus
                ? `${equipamento.btus} BTU`
                : "-"
        );


        // Depois de carregar o equipamento,
        // carrega seu histórico.
        await carregarHistorico();

    }

    catch(error){

        console.error(
            "Erro ao carregar equipamento:",
            error
        );

    }

}


// ============================================
// CARREGAR HISTÓRICO
// ============================================
//
// O sistema suporta as duas estruturas:
//
// 1. equipamentos/{id}/manutencoes
//
// 2. manutencoes
//    onde:
//    equipamento = "AC-002"
//
// Assim evitamos perder os registros
// antigos que já foram cadastrados.
// ============================================

async function carregarHistorico(){

    try{

        if(!listaManutencoes){

            console.error(
                "Elemento #listaManutencoes não encontrado."
            );

            return;
        }


        // ------------------------------------
        // ESTRUTURA 1
        // SUBCOLEÇÃO DO EQUIPAMENTO
        // ------------------------------------

        const referenciaSubcolecao =
            collection(
                db,
                "equipamentos",
                idEquipamento,
                "manutencoes"
            );


        // ------------------------------------
        // ESTRUTURA 2
        // COLEÇÃO GERAL
        // ------------------------------------

        const referenciaGeral =
            collection(
                db,
                "manutencoes"
            );


        const [
            resultadoSubcolecao,
            resultadoGeral
        ] = await Promise.all([

            getDocs(
                referenciaSubcolecao
            ),

            getDocs(
                referenciaGeral
            )

        ]);


        const manutencoes = [];


        // ====================================
        // REGISTROS DA SUBCOLEÇÃO
        // ====================================

        resultadoSubcolecao.forEach(
            documento => {

                const dados =
                    documento.data();


                manutencoes.push({

                    id:
                        `sub-${documento.id}`,

                    ...dados,

                    origem:
                        "subcolecao"

                });

            }
        );


        // ====================================
        // REGISTROS DA COLEÇÃO GERAL
        // ====================================

        resultadoGeral.forEach(
            documento => {

                const dados =
                    documento.data();


                const equipamentoRelacionado =
                    dados.equipamento ||
                    dados.codigoEquipamento ||
                    dados.equipamentoId;


                if(
                    equipamentoRelacionado ===
                    idEquipamento
                ){

                    manutencoes.push({

                        id:
                            `geral-${documento.id}`,

                        ...dados,

                        origem:
                            "colecao-geral"

                    });

                }

            }
        );


        // ====================================
        // EVITAR DUPLICIDADES
        // ====================================

        const mapa =
            new Map();


        manutencoes.forEach(
            manutencao => {

                const chave = [

                    manutencao.data || "",

                    manutencao.tipo || "",

                    manutencao.tecnico || "",

                    manutencao.observacao || ""

                ].join("|");


                if(!mapa.has(chave)){

                    mapa.set(
                        chave,
                        manutencao
                    );

                }

            }
        );


        const listaFinal =
            Array.from(
                mapa.values()
            );


        // ====================================
        // ORDENAR DO MAIS RECENTE PARA O MAIS
        // ANTIGO
        // ====================================

        listaFinal.sort(
            (a, b) => {

                const dataA =
                    String(
                        a.data || ""
                    );

                const dataB =
                    String(
                        b.data || ""
                    );

                return dataB.localeCompare(
                    dataA
                );

            }
        );


        // ====================================
        // LIMPAR TABELA
        // ====================================

        listaManutencoes.innerHTML =
            "";


        // ====================================
        // NENHUMA MANUTENÇÃO
        // ====================================

        if(listaFinal.length === 0){

            listaManutencoes.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        class="sem-manutencao"
                    >

                        Nenhuma manutenção
                        registrada.

                    </td>

                </tr>

            `;

            console.log(
                "Nenhuma manutenção encontrada para:",
                idEquipamento
            );

            return;
        }


        // ====================================
        // RENDERIZAR HISTÓRICO
        // ====================================

        listaFinal.forEach(
            manutencao => {

                const status =
                    manutencao.status ||
                    "Concluído";


                const classeStatus =
                    status
                        .toLowerCase()
                        .includes("concl")
                            ? "concluido"
                            : "";


                listaManutencoes.innerHTML += `

                    <tr>

                        <td>
                            ${formatarData(
                                manutencao.data
                            )}
                        </td>


                        <td>
                            ${
                                manutencao.tipo ||
                                "-"
                            }
                        </td>


                        <td>
                            ${
                                manutencao.tecnico ||
                                manutencao.responsavel ||
                                "-"
                            }
                        </td>


                        <td>

                            <span
                                class="status ${classeStatus}"
                            >

                                ${status}

                            </span>

                        </td>

                    </tr>

                `;

            }
        );


        console.log(
            "Histórico carregado:",
            listaFinal.length,
            "manutenção(ões)"
        );

    }

    catch(error){

        console.error(
            "Erro ao carregar histórico:",
            error
        );


        if(listaManutencoes){

            listaManutencoes.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        class="erro-historico"
                    >

                        Não foi possível
                        carregar o histórico.

                    </td>

                </tr>

            `;

        }

    }

}


// ============================================
// NOVA MANUTENÇÃO
// ============================================

if(botaoManutencao){

    botaoManutencao.addEventListener(
        "click",
        () => {

            window.location.href =
                `cadastro_manutencao.html?id=${encodeURIComponent(
                    idEquipamento
                )}`;

        }
    );

}


// ============================================
// VOLTAR
// ============================================

if(botaoVoltar){

    botaoVoltar.addEventListener(
        "click",
        () => {

            window.location.href =
                "equipamentos.html";

        }
    );

}


// ============================================
// INICIAR
// ============================================

carregarEquipamento();