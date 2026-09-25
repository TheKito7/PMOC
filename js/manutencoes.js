// ============================================
// PMOC ENERGISA
// MÓDULO DE MANUTENÇÕES
// ============================================

import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================
// VARIÁVEIS
// ============================================

let listaManutencoes = [];


// ============================================
// ELEMENTOS
// ============================================

const tabela =
    document.getElementById(
        "listaManutencoes"
    );

const total =
    document.getElementById(
        "totalManutencoes"
    );

const preventivas =
    document.getElementById(
        "totalPreventivas"
    );

const corretivas =
    document.getElementById(
        "totalCorretivas"
    );

const pendentes =
    document.getElementById(
        "totalPendentes"
    );


// ============================================
// FILTROS
// ============================================

const filtroTipo =
    document.getElementById(
        "filtroTipo"
    );

const filtroStatus =
    document.getElementById(
        "filtroStatus"
    );

const filtroEquipamento =
    document.getElementById(
        "filtroEquipamento"
    );


// ============================================
// FORMATAR DATA
// ============================================

function formatarData(data) {

    if (!data) {
        return "-";
    }


    // Firestore Timestamp
    if (
        typeof data === "object" &&
        typeof data.toDate === "function"
    ) {

        return data
            .toDate()
            .toLocaleDateString("pt-BR");

    }


    const texto =
        String(data);


    // Formato yyyy-mm-dd
    if (
        /^\d{4}-\d{2}-\d{2}$/.test(texto)
    ) {

        const partes =
            texto.split("-");

        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }


    return texto;
}


// ============================================
// DATA PARA ORDENAÇÃO
// ============================================

function obterDataOrdenacao(item) {

    // criadoEm
    if (
        item.criadoEm &&
        typeof item.criadoEm.toDate === "function"
    ) {

        return item.criadoEm
            .toDate()
            .getTime();

    }


    // data da manutenção
    if (item.data) {

        const partes =
            String(item.data).split("-");


        if (partes.length === 3) {

            return new Date(
                Number(partes[0]),
                Number(partes[1]) - 1,
                Number(partes[2])
            ).getTime();

        }

    }


    return 0;
}


// ============================================
// BUSCAR MANUTENÇÕES
// ============================================

async function carregarManutencoes() {

    try {

        console.log(
            "Carregando manutenções..."
        );


        if (!tabela) {

            console.error(
                "Elemento #listaManutencoes não encontrado."
            );

            return;
        }


        // ------------------------------------
        // COLEÇÃO GERAL
        // ------------------------------------

        const referencia =
            collection(
                db,
                "manutencoes"
            );


        const resultado =
            await getDocs(
                referencia
            );


        listaManutencoes = [];


        // ------------------------------------
        // TRANSFORMAR DOCUMENTOS EM ARRAY
        // ------------------------------------

        resultado.forEach(
            documento => {

                const dados =
                    documento.data();


                listaManutencoes.push({

                    id:
                        documento.id,

                    ...dados

                });

            }
        );


        // ------------------------------------
        // ORDENAR
        // MAIS RECENTE PRIMEIRO
        // ------------------------------------

        listaManutencoes.sort(
            (a, b) => {

                return (
                    obterDataOrdenacao(b) -
                    obterDataOrdenacao(a)
                );

            }
        );


        console.log(
            "Manutenções encontradas:",
            listaManutencoes
        );


        // ------------------------------------
        // ATUALIZAR INDICADORES
        // ------------------------------------

        atualizarIndicadores();


        // ------------------------------------
        // MOSTRAR TABELA
        // ------------------------------------

        mostrarTabela(
            listaManutencoes
        );

    }

    catch (error) {

        console.error(
            "Erro ao carregar manutenções:",
            error
        );


        if (tabela) {

            tabela.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="erro-tabela"
                    >

                        Não foi possível
                        carregar as manutenções.

                    </td>

                </tr>

            `;

        }

    }

}


// ============================================
// INDICADORES
// ============================================

function atualizarIndicadores() {

    let totalPreventiva = 0;

    let totalCorretiva = 0;

    let totalPendente = 0;


    listaManutencoes.forEach(
        item => {

            const tipo =
                String(
                    item.tipo || ""
                ).trim().toLowerCase();


            const status =
                String(
                    item.status || ""
                ).trim().toLowerCase();


            if (
                tipo === "preventiva"
            ) {

                totalPreventiva++;

            }


            if (
                tipo === "corretiva"
            ) {

                totalCorretiva++;

            }


            if (
                status === "pendente"
            ) {

                totalPendente++;

            }

        }
    );


    if (total) {

        total.textContent =
            listaManutencoes.length;

    }


    if (preventivas) {

        preventivas.textContent =
            totalPreventiva;

    }


    if (corretivas) {

        corretivas.textContent =
            totalCorretiva;

    }


    if (pendentes) {

        pendentes.textContent =
            totalPendente;

    }

}


// ============================================
// STATUS
// ============================================

function criarStatus(status) {

    const valor =
        status || "Concluído";


    const classe =
        String(valor)
            .toLowerCase()
            .includes("concl")
                ? "verde-status"
                : "status-pendente";


    return `

        <span class="status ${classe}">

            ${valor}

        </span>

    `;

}


// ============================================
// MOSTRAR TABELA
// ============================================

function mostrarTabela(dados) {

    if (!tabela) {

        return;

    }


    // ------------------------------------
    // NENHUM RESULTADO
    // ------------------------------------

    if (dados.length === 0) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="sem-resultados"
                >

                    Nenhuma manutenção
                    encontrada.

                </td>

            </tr>

        `;

        return;

    }


    tabela.innerHTML = "";


    // ------------------------------------
    // GERAR LINHAS
    // ------------------------------------

    dados.forEach(
        item => {

            const equipamento =
                item.equipamento ||
                item.codigoEquipamento ||
                "-";


            const responsavel =
                item.tecnico ||
                item.responsavel ||
                "-";


            const tipo =
                item.tipo ||
                "-";


            const status =
                item.status ||
                "Concluído";


            const linha =
                document.createElement("tr");


            linha.innerHTML = `

                <td>

                    ${formatarData(
                        item.data
                    )}

                </td>


                <td>

                    <strong class="codigo-equipamento">

                        ${equipamento}

                    </strong>

                </td>


                <td>

                    ${tipo}

                </td>


                <td>

                    ${responsavel}

                </td>


                <td>

                    ${criarStatus(
                        status
                    )}

                </td>


                <td>

                    <a
                        href="detalhes_equipamento.html?id=${encodeURIComponent(equipamento)}"
                        class="acao-visualizar"
                        title="Ver equipamento"
                    >

                        <i class="bx bx-show"></i>

                    </a>

                </td>

            `;


            tabela.appendChild(
                linha
            );

        }
    );

}


// ============================================
// APLICAR FILTROS
// ============================================

function aplicarFiltros() {

    let resultado =
        [...listaManutencoes];


    // ------------------------------------
    // FILTRO POR TIPO
    // ------------------------------------

    if (
        filtroTipo &&
        filtroTipo.value
    ) {

        resultado =
            resultado.filter(
                item => {

                    return (
                        String(
                            item.tipo || ""
                        ).toLowerCase()
                        ===
                        String(
                            filtroTipo.value
                        ).toLowerCase()
                    );

                }
            );

    }


    // ------------------------------------
    // FILTRO POR STATUS
    // ------------------------------------

    if (
        filtroStatus &&
        filtroStatus.value
    ) {

        resultado =
            resultado.filter(
                item => {

                    return (
                        String(
                            item.status ||
                            "Concluído"
                        ).toLowerCase()
                        ===
                        String(
                            filtroStatus.value
                        ).toLowerCase()
                    );

                }
            );

    }


    // ------------------------------------
    // BUSCA POR EQUIPAMENTO
    // ------------------------------------

    if (
        filtroEquipamento &&
        filtroEquipamento.value.trim()
    ) {

        const busca =
            filtroEquipamento.value
                .trim()
                .toLowerCase();


        resultado =
            resultado.filter(
                item => {

                    const equipamento =
                        String(
                            item.equipamento ||
                            item.codigoEquipamento ||
                            ""
                        ).toLowerCase();


                    return equipamento
                        .includes(busca);

                }
            );

    }


    mostrarTabela(
        resultado
    );

}


// ============================================
// EVENTOS
// ============================================

if (filtroTipo) {

    filtroTipo.addEventListener(
        "change",
        aplicarFiltros
    );

}


if (filtroStatus) {

    filtroStatus.addEventListener(
        "change",
        aplicarFiltros
    );

}


if (filtroEquipamento) {

    filtroEquipamento.addEventListener(
        "input",
        aplicarFiltros
    );

}


// ============================================
// INICIAR
// ============================================

carregarManutencoes();