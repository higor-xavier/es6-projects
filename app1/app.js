class Despesa{
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados(){
		for(let i in this){
			if (this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

class Bd{

	constructor(){
		let id = localStorage.getItem('id')
		if (id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId(){
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d){
		//para utilizar a setItem do localStorage precisa-se 
		//passar a despesa como JSON, por isso usamos a stringify()
		let id = this.getProximoId()
		localStorage.setItem(id, JSON.stringify(d))
		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros(){

		//array de despesas
		let despesas = []

		let id = localStorage.getItem('id')

		//recuperar todas as despesas cadastradas no localStorage
		for (var i = 1; i <= id; i++) {
			//recuperar a despesa
			let despesa = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver itens que foram removidos
			//se houver, pulamos esses itens
			if (despesa === null) {
				continue
			}

			despesa.id = i
			despesas.push(despesa)
		}
		return despesas
	}

	pesquisar(despesa){
		let despesasFiltradas = []
		despesasFiltradas = this.recuperarTodosRegistros()

		//ano
		if (despesa.ano != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}

		//mes
		if (despesa.mes != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		//dia
		if (despesa.dia != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}
		//tipo
		if (despesa.tipo != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		//descricao
		if (despesa.descricao != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		//valor
		if (despesa.valor != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		return despesasFiltradas
	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()

function cadastrarDespesa(){

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value,
		mes.value,
		dia.value,
		tipo.value,
		descricao.value,
		valor.value
	)

	if (despesa.validarDados()) {
		bd.gravar(despesa)
		//dialog de sucesso
		document.getElementById('corTexto').className = 'modal-header text-success'
		document.getElementById('exampleModalLabel1').innerHTML = 'Registro inserido com sucesso!'
		document.getElementById('bodyModal').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('btnModal').className += 'btn btn-success'
		document.getElementById('btnModal').innerHTML = 'Voltar'
		$('#modalRegistraDespesa').modal('show')

		//zerando os campos para inser????o de novos dados
		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
	}
	else{
		//dialog de erro
		document.getElementById('corTexto').className = 'modal-header text-danger'
		document.getElementById('exampleModalLabel1').innerHTML = 'Erro na grava????o'
		document.getElementById('bodyModal').innerHTML = 'Existem campos obrigat??rios que n??o foram preenchidos!'
		document.getElementById('btnModal').className = 'btn btn-danger'
		document.getElementById('btnModal').innerHTML = 'Voltar e corrigir'
		$('#modalRegistraDespesa').modal('show')
	}
}

function carregaListaDespesas(despesas = Array(), filtro = false) {

	if (despesas.length == 0 && filtro == false) {
		despesas = bd.recuperarTodosRegistros()
	}

	//Selecionando o elemento tbody da tabela
	var listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML = ''

	//percorrer o array despesas, listando cada despesa de forma din??mica
	despesas.forEach(function(d){

		//criando a linha (tr)
		let linha = listaDespesas.insertRow() //esse m??todo insere uma linha a cada intera????o do forEach na tabela listaDespesas

		//criar as colunas(td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` //esse m??todo cria as colunas e como par??metro um valor.

		//ajustar o tipo
		switch(d.tipo){
			case '1': d.tipo = 'Alimenta????o'
				break
			case '2': d.tipo = 'Educa????o'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Sa??de'
				break
			case '5': d.tipo = 'Transporte'
				break	 
		}
		linha.insertCell(1).innerHTML = d.tipo

		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		//criar bot??o de exclus??o
		let btn = document.createElement("button")
		btn.className = 'btn btn-outline-danger'
		btn.innerHTML = '<i class= "fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function(){
			//remover item
			let id = this.id.replace('id_despesa_', '')
			bd.remover(id)
			window.location.reload()
		}
		linha.insertCell(4).append(btn)

		console.log(d)

	})
}

function pesquisarDespesa() {
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(
		ano,
		mes,
		dia,
		tipo,
		descricao,
		valor
	)

	let despesas = bd.pesquisar(despesa)

	carregaListaDespesas(despesas, true)
}
