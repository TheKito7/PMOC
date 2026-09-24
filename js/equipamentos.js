// ============================================
// PMOC ENERGISA
// MÓDULO: EQUIPAMENTOS
// ============================================


import { db } from "./firebase.js";


import {

    collection,
    getDocs,
    deleteDoc,
    doc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// ============================================
// ELEMENTOS HTML
// ============================================


const tabela =
document.getElementById("tabelaEquipamentos");


const totalEquipamentos =
document.getElementById("totalEquipamentos");







// ============================================
// CARREGAR EQUIPAMENTOS
// ============================================


async function carregarEquipamentos(){


    try{


        const consulta = await getDocs(

            collection(
                db,
                "equipamentos"
            )

        );



        console.log(
            "Quantidade equipamentos:",
            consulta.size
        );



        tabela.innerHTML = "";




        // Atualiza card


        if(totalEquipamentos){


            totalEquipamentos.innerHTML =
            consulta.size;


        }






        if(consulta.empty){


            tabela.innerHTML = `


            <tr>

                <td colspan="8">

                    Nenhum equipamento cadastrado.

                </td>


            </tr>


            `;


            return;


        }







        consulta.forEach((documento)=>{


            const equipamento =
            documento.data();



            console.log(
                "Equipamento:",
                equipamento
            );





            tabela.innerHTML += `


            <tr>


                <td>
                    ${equipamento.codigo ?? "-"}
                </td>




                <td>
                    ${equipamento.unidade ?? "-"}
                </td>




                <td>
                    ${equipamento.ambiente ?? "-"}
                </td>




                <td>
                    ${equipamento.marca ?? "-"}
                </td>




                <td>
                    ${equipamento.btus ?? "-"}
                </td>




                <td>
                    ${equipamento.ultimaManutencao ?? "-"}
                </td>




                <td>

                    <span class="status verde-status">

                        ${equipamento.status ?? "-"}

                    </span>


                </td>





                <td class="acoes-tabela">



                    <a

                    href="detalhes_equipamento.html?id=${equipamento.codigo}"

                    title="Visualizar">


                        <i class='bx bx-show'></i>


                    </a>





                    <a

                    href="cadastro_equipamento.html?id=${equipamento.codigo}"

                    title="Editar">


                        <i class='bx bx-edit'></i>


                    </a>






                    <a

                    href="#"

                    class="excluir"

                    data-id="${documento.id}"

                    title="Excluir">


                        <i class='bx bx-trash'></i>


                    </a>



                </td>




            </tr>



            `;



        });







        ativarExcluir();



    }


    catch(error){


        console.error(

            "Erro ao carregar equipamentos:",
            error

        );



        tabela.innerHTML = `


        <tr>

            <td colspan="8">

                Erro ao carregar dados.

            </td>


        </tr>


        `;



    }



}









// ============================================
// EXCLUIR EQUIPAMENTO
// ============================================


function ativarExcluir(){



    const botoesExcluir =
    document.querySelectorAll(".excluir");





    botoesExcluir.forEach((botao)=>{



        botao.addEventListener(
        "click",
        async (evento)=>{



            evento.preventDefault();




            const id =
            botao.dataset.id;





            const confirmar =
            confirm(
            "Deseja excluir este equipamento?"
            );





            if(confirmar){


                await deleteDoc(

                    doc(
                        db,
                        "equipamentos",
                        id
                    )

                );



                carregarEquipamentos();



            }



        });



    });



}







// ============================================
// INICIAR
// ============================================


carregarEquipamentos();