// ============================================
// PMOC ENERGISA
// DETALHES DA MANUTENÇÃO
// ============================================

import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================
// PARÂMETROS DA URL
// ============================================

const parametros =
    new URLSearchParams(
        window.location.search
    );


const equipamentoId =
    parametros.get("equipamento");


const manutencaoId =
    parametros.get("id");


console.log(
    "Equipamento:",
    equipamentoId
);

console.log(
    "Manutenção:",
    manutencaoId
);


// ============================================
// ELEMENTOS
// ============================================

const status =
    document.getElementById(
        "statusManutencao"
    );

const tipo =
    document.getElementById(
        "tipoManutencao"
    );

const codigo =
    document.getElementById(
        "codigoEquipamento"
    );

const unidade =
    document.getElementById(
        "unidadeEquipamento"
    );

const ambiente =
    document.getElementById(
        "ambienteEquipamento"
    );

const data =
    document.getElementById(
        "dataManutencao"
    );

const tecnico =
    document.getElementById(
        "tecnicoManutencao"
    );

const criadoEm =
    document.getElementById(
        "criadoEm"
    );

const servicos =
    document.getElementById(
        "listaServicos"
    );

const observacao =
    document.getElementById(
        "observacaoManutencao"
    );

const btnVoltar =
    document.getElementById(
        "btnVoltar"
    );


// ============================================
// PREENCHER
// ============================================

function preencher(
    elemento,
    valor
) {

    if (!elemento) {
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
// DATA
// ============================================

function formatarData(valor) {

    if (!valor) {
        return "-";
    }


    if (
        typeof valor === "object" &&
        typeof valor.toDate === "function"
    ) {

        return valor
            .toDate()
            .toLocaleDateString(
                "pt-BR"
            );

    }


    const texto =
        String(valor);


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
// CARREGAR MANUTENÇÃO
// ============================================

async function carregarManutencao() {

    try {

        if (
            !equipamentoId ||
            !manutencaoId
        ) {

            throw new Error(
                "Parâmetros da manutenção não foram informados."
            );

        }


        // ====================================
        // DOCUMENTO DA MANUTENÇÃO
        // ====================================

        const referencia =
            doc(
                db,
                "equipamentos",
                equipamentoId,
                "manutencoes",
                manutencaoId
            );


        const resultado =
            await getDoc(
                referencia
            );


        if (!resultado.exists()) {

            throw new Error(
                "Manutenção não encontrada."
            );

        }


        const manutencao =
            resultado.data();


        console.log(
            "Manutenção encontrada:",
            manutencao
        );


        // ====================================
        // CARREGAR EQUIPAMENTO
        // ====================================

        const equipamentoReferencia =
            doc(
                db,
                "equipamentos",
                equipamentoId
            );


        const equipamentoResultado =
            await getDoc(
                equipamentoReferencia
            );


        if (
            equipamentoResultado.exists()
        ) {

            const equipamento =
                equipamentoResultado.data();


            preencher(
                codigo,
                equipamento.codigo ||
                equipamentoId
            );


            preencher(
                unidade,
                equipamento.unidade
            );


            preencher(
                ambiente,
                equipamento.ambiente
            );

        } else {

            preencher(
                codigo,
                equipamentoId
            );

        }


        // ====================================
        // DADOS DA MANUTENÇÃO
        // ====================================

        preencher(
            tipo,
            manutencao.tipo
        );


        preencher(
            data,
            formatarData(
                manutencao.data
            )
        );


        preencher(
            tecnico,
            manutencao.tecnico ||
            manutencao.responsavel
        );


        preencher(
            criadoEm,
            formatarData(
                manutencao.criadoEm
            )
        );


        preencher(
            observacao,
            manutencao.observacao
        );


        // ====================================
        // STATUS
        // ====================================

        const valorStatus =
            manutencao.status ||
            "Concluído";


        if (status) {

            status.textContent =
                valorStatus;


            status.className =
                "status-detalhe";


            if (
                String(valorStatus)
                    .toLowerCase()
                    .includes("concl")
            ) {

                status.classList.add(
                    "status-concluido"
                );

            } else {

                status.classList.add(
                    "status-pendente"
                );

            }

        }


        // ====================================
        // SERVIÇOS
        // ====================================

        renderizarServicos(
            manutencao.servicos
        );

    }

    catch(error) {

        console.error(
            "Erro ao carregar manutenção:",
            error
        );


        if (servicos) {

            servicos.innerHTML = `

                <div class="erro-detalhes">

                    Não foi possível carregar
                    esta manutenção.

                </div>

            `;

        }

    }

}


// ============================================
// SERVIÇOS
// ============================================

function renderizarServicos(lista) {

    if (!servicos) {
        return;
    }


    servicos.innerHTML = "";


    if (
        !Array.isArray(lista) ||
        lista.length === 0
    ) {

        servicos.innerHTML = `

            <div class="sem-servicos">

                Nenhum serviço detalhado
                foi registrado.

            </div>

        `;

        return;

    }


    lista.forEach(
        item => {

            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "servico-item";


            elemento.innerHTML = `

                <i class="bx bx-check"></i>

                <span>
                    ${item}
                </span>

            `;


            servicos.appendChild(
                elemento
            );

        }
    );

}


// ============================================
// VOLTAR
// ============================================

if (btnVoltar) {

    btnVoltar.addEventListener(
        "click",
        () => {

            window.location.href =
                "manutencao.html";

        }
    );

}


// ============================================
// INICIAR
// ============================================

carregarManutencao();