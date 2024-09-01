let registros = [];
let poupanca = 0;

function adicionarRegistro() {
    let data = document.getElementById("data-registro").value;
    let tipo = document.getElementById("tipo-registro").value;
    let descricao = document.getElementById("descricao-registro").value;
    let valor = parseFloat(document.getElementById("valor-registro").value);

    if (data && tipo && descricao && valor) {
        registros.push({ data, tipo, descricao, valor });
        atualizarTabela();
        calcularResumo();
        gerarResumoMensal(); // Atualiza o resumo mensal
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

function atualizarTabela() {
    let tbody = document.getElementById("tabela-financeira").getElementsByTagName('tbody')[0];
    tbody.innerHTML = "";

    registros.forEach((registro, index) => {
        let row = tbody.insertRow();
        row.insertCell(0).innerText = registro.data;
        row.insertCell(1).innerText = registro.tipo === "salario" ? "Salário" : (registro.tipo === "vale" ? "Vale" : "Despesa");
        row.insertCell(2).innerText = registro.descricao;
        row.insertCell(3).innerText = `R$ ${registro.valor.toFixed(2)}`;

        let cellAcoes = row.insertCell(4);
        let btnExcluir = document.createElement("button");
        btnExcluir.innerText = "Excluir";
        btnExcluir.onclick = () => excluirRegistro(index);
        cellAcoes.appendChild(btnExcluir);
    });
}

function excluirRegistro(index) {
    registros.splice(index, 1);
    atualizarTabela();
    calcularResumo();
    gerarResumoMensal(); // Atualiza o resumo mensal
}

function calcularResumo() {
    let totalSalario = registros.filter(r => r.tipo === "salario").reduce((acc, cur) => acc + cur.valor, 0);
    let totalVale = registros.filter(r => r.tipo === "vale").reduce((acc, cur) => acc + cur.valor, 0);
    let totalDespesas = registros.filter(r => r.tipo === "despesa").reduce((acc, cur) => acc + cur.valor, 0);
    let poupancaIdeal = totalSalario * 0.1;  // Define 10% do salário para a poupança
    let valorDisponivel = totalSalario + totalVale - totalDespesas - poupanca - poupancaIdeal;  // Calcula o valor disponível após despesas e poupança

    document.getElementById("resumo-financeiro").innerText = `
        Total Salário: R$ ${totalSalario.toFixed(2)}
        Total Vale: R$ ${totalVale.toFixed(2)}
        Total Despesas: R$ ${totalDespesas.toFixed(2)}
        Poupança Ideal (10%): R$ ${poupancaIdeal.toFixed(2)}
        Valor Disponível para Gastos: R$ ${valorDisponivel.toFixed(2)}
    `;
}

function adicionarPoupanca() {
    let valor = parseFloat(document.getElementById("valor-poupanca").value);
    
    if (valor) {
        poupanca += valor;
        calcularPoupanca();
        calcularResumo();
        gerarResumoMensal(); // Atualiza o resumo mensal
    } else {
        alert("Por favor, insira um valor para a poupança.");
    }
}

function excluirPoupanca(valor) {
    if (poupanca >= valor) {
        poupanca -= valor;
        calcularPoupanca();
        calcularResumo();
        gerarResumoMensal(); // Atualiza o resumo mensal
    } else {
        alert("Valor na poupança insuficiente para excluir essa quantia.");
    }
}

function calcularPoupanca() {
    document.getElementById("resumo-poupanca").innerHTML = `
        Total Poupança: R$ ${poupanca.toFixed(2)}
        <button onclick="excluirPoupanca(${poupanca})">Excluir Poupança</button>
    `;
}

function gerarResumoMensal() {
    let resumoMensal = {};
    registros.forEach(registro => {
        let mes = registro.data.substring(0, 7); // "AAAA-MM"
        if (!resumoMensal[mes]) {
            resumoMensal[mes] = { salario: 0, vale: 0, despesas: 0, poupanca: poupanca };
        }
        if (registro.tipo === "salario") resumoMensal[mes].salario += registro.valor;
        if (registro.tipo === "vale") resumoMensal[mes].vale += registro.valor;
        if (registro.tipo === "despesa") resumoMensal[mes].despesas += registro.valor;
    });

    let resumoHtml = "<table><tr><th>Mês</th><th>Salário</th><th>Vale</th><th>Despesas</th><th>Poupança</th></tr>";
    for (let mes in resumoMensal) {
        resumoHtml += `
            <tr>
                <td>${mes}</td>
                <td>R$ ${resumoMensal[mes].salario.toFixed(2)}</td>
                <td>R$ ${resumoMensal[mes].vale.toFixed(2)}</td>
                <td>R$ ${resumoMensal[mes].despesas.toFixed(2)}</td>
                <td>R$ ${resumoMensal[mes].poupanca.toFixed(2)}</td>
            </tr>`;
    }
    resumoHtml += "</table>";
    
    document.getElementById("resumo-mensal-conteudo").innerHTML = resumoHtml;
}

// Função para abrir as abas
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Abre a aba padrão ao carregar a página
document.getElementById("defaultOpen").click();
