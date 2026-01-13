# manuais-10

# **Kaptor V3S** **Manual de Operação**


MANUAL DE OPERAÇÃO


MANUAL DE OPERAÇÃO


**ÍNDICE**

1 - INTRODUÇÃO ......................................................................................................................................... 4
2 – APRESENTANDO O KAPTOR V3S ....................................................................................................... 4

2.1 – VISTA GERAL DO MÓDULO .......................................................................................................... 4

2.2 – KIT DE TESTE ................................................................................................................................. 6
3 – OPERAÇÃO ............................................................................................................................................ 7

3.1 – PREPARANDO O EQUIPAMENTO................................................................................................. 7
3.2 – SELECIONANDO O VEÍCULO ........................................................................................................ 8
3.3 – MODOS DE OPERAÇÃO ................................................................................................................ 9

3.3.1 – MODO TESTE ........................................................................................................................ 10
3.3.2 – MODO CONTÍNUO ................................................................................................................ 10

3.3.3 – MODO UNIDADE DE COMANDO ......................................................................................... 12
3.4 – SELEÇÃO DO MESMO VEÍCULO ................................................................................................ 13
3.5 – DIAGNÓSTICO VIA PC ................................................................................................................. 14
3.6 – CONEXÃO VIA BLUETOOTH ....................................................................................................... 14
3.7 – FUNÇÃO RDS .................................................................................................................................... 15
4 – OPERAÇÃO COM CRÉDITOS ............................................................................................................. 15
5 – LIBERAÇÃO .......................................................................................................................................... 16
6 – CUIDADOS GERAIS E RECOMENDAÇÕES ....................................................................................... 16
8 – ESPECIFICAÇÕES TÉCNICAS ............................................................................................................ 18
9 – TERMO DE GARANTIA ........................................................................................................................ 18


9.2 – SOFTWARE ................................................................................................................................... 19
9.3 – LOCAL DE EXECUÇÂO DAS REPARAÇÕES COBERTAS PELA GARANTIA ........................... 20
9.4 – TRANSPORTE ............................................................................................................................... 20
9.5 – LICENÇA DE USO DE SOFTWARE - DIREITOS DE AUTOR ..................................................... 21


MANUAL DE OPERAÇÃO


**1 - INTRODUÇÃO**


Este Manual de Operação apresenta a operação básica do equipamento, assim como o uso
genérico das funções do teclado e das entradas e saídas dos conectores que estão disponíveis, para que
o mesmo possa funcionar de maneira adequada e possibilitar ao operador a execução dos programas de
testes, como será exposto adiante.


**2 – APRESENTANDO O KAPTOR V3S**


O **Scanner** **Kaptor V3S** é a uma ferramenta do técnico de reparação automotiva, sendo uma
plataforma genérica para a realização de diagnóstico dos veículos.

Os circuitos eletrônicos do equipamento foram desenvolvidos a fim de suportarem de forma
genérica o teste de sistemas de eletrônica embarcada que atualmente estão disponíveis no mercado.

A arquitetura do scanner é baseada em um microcontrolador de baixo consumo, permitindo uma
operação extremamente rápida e segura, sendo os resultados dos testes e diagnósticos apresentados
através de um visor de cristal líquido, com iluminação própria, o que possibilita o uso inclusive em locais
de baixa iluminação.

A operação do equipamento foi elaborada de forma que os comandos sejam simples e precisos,
havendo, sempre que necessário, uma orientação feita pelo programa.


**2.1 – VISTA GERAL DO MÓDULO**


Abaixo temos uma visão geral do módulo básico do **Kaptor V3S** (módulo) e dos acessórios que
acompanham o produto, contendo uma explicação sucinta das suas respectivas funções.


**ATENÇÃO:** O produto **Scanner Kaptor V3S Auto – Upgrade Basic é fornecido apenas com o**
**Cabo OBD Master e sem outros acessórios** (Maleta para Scanner, Cabo de Alimentação via
Acendedor de Cigarro, Cabo de Alimentação via Bateria tipo Jacaré, Cabos Adaptadores conforme
descritos no item 2.2 abaixo), que são fornecidos apenas no produto **Scanner Kaptor V3S Auto** .


MANUAL DE OPERAÇÃO


1 - Conector de Comunicação e Alimentação: permite a conexão do Cabo de Diagnóstico Universal que
interliga o módulo ao conector de diagnóstico do veículo e é por ele que é feita a alimentação do
equipamento, através do próprio conector de diagnóstico do veículo ou, para os casos dos veículos que
não possuem alimentação no conector de diagnóstico, através do Cabo Adaptador (ver detalhes no item
2.2 abaixo) e do Cabo de Alimentação via Acendedor de Cigarros ou do Cabo de Alimentação via Bateria
tipo Jacaré.


**ATENÇÃO:** O Cabo de Alimentação via Acendedor de Cigarro e o Cabo de Alimentação via
Bateria tipo Jacaré **NÃO SÃO FORNECIDOS** no produto **SCANNER KAPTOR V3S AUTO – UPGRADE**
**BASIC**, sendo fornecidos apenas no produto **Scanner Kaptor V3S Auto** .


MANUAL DE OPERAÇÃO


2 - Conector USB: usado para o diagnóstico no PC e atualização dos sistemas de diagnósticos.

3 - Visor de Cristal Líquido: contém quatro linhas com 20 caracteres cada, possuindo iluminação própria
de fundo para ambientes de baixa luminosidade. É através do visor que o operador recebe orientações e

o resultado dos testes executados.

4 - Tecla Reset (“R”): ao manter pressionada esta tecla por aproximadamente 2 segundos, o equipamento
reinicia suas funções. Nota: caso a tela inicial não seja apresentada após o reset, deve-se realizar o

procedimento de reset novamente.

5 - Teclas de Direção: permitem ao operador intervir na escolha de opções do programa, como por
exemplo, no modelo do veículo a ser testado ou para visualizar a sequência recebida de códigos de
serviço (falhas encontradas).

6 - Tecla Retorna: é usada para interromper a execução do programa ou voltar à tela anterior
apresentada no visor.

7 - Tecla Entra: é usada para confirmar a opção selecionada pelo operador durante o programa ou para
executar as funções apresentadas no visor.


**2.2 – KIT DE TESTE**


Para que o scanner possa funcionar, ele depende de programas que estão preparados para
diagnosticar os modelos de veículos, bastando ao usuário instalar o kit de teste para iniciar a operação do
equipamento. A seguir, tem-se uma visão geral dos itens que compõe um kit de teste.

**- Cabo OBD Master**


Para a utilização do módulo, é necessária apenas a utilização do Cabo OBD Master e, para os
veículos que não possuem conector de diagnóstico no padrão OBD, o Cabo Adaptador específico do
veículo, conforme os detalhes apresentados no item abaixo. Para o caso do operador desejar aumentar o
comprimento do cabo, dispomos do Cabo Adaptador Extensão 2m OBD, que é vendido separadamente
como um item opcional do produto.


MANUAL DE OPERAÇÃO


**- Cabos Adaptadores**


Alguns veículos necessitam de um Cabo Adaptador específico por não utilizarem conector de
diagnóstico no padrão OBD. Para essa situação, dispomos de Cabos Adaptadores. O **Scanner Kaptor**
**V3S Auto** é fornecido com os seguintes Cabos Adaptadores: **FIAT 3 PIN** e **GM 10 PIN** . Os outros Cabos
Adaptadores são vendidos separadamente como itens opcionais do produto. Além disso, pode ocorrer a
situação do conector de diagnóstico do veículo não oferecer a alimentação do equipamento. Nesse caso,
o Cabo Adaptador possui embutido um conector P4 onde deve ser ligado o Cabo de Alimentação via
Acendedor de Cigarro ou o Cabo de Alimentação via Bateria tipo Jacaré. Para os Cabos Adaptadores que
não possuem esse conector P4, já existe a alimentação através do conector de diagnóstico do veículo.


**ATENÇÃO:** Os Cabos Adaptadores FIAT 3 PIN e GM 10 PIN **NÃO SÃO FORNECIDOS** no
produto **SCANNER KAPTOR V3S AUTO – UPGRADE BASIC**, sendo fornecidos apenas no produto
**Scanner Kaptor V3S Auto** .


**3 – OPERAÇÃO**


**3.1 – PREPARANDO O EQUIPAMENTO**


Conectar o Cabo ODB Master lado DB15 ao módulo e a outra extremidade do cabo lado OBD

ao conector de diagnóstico do veículo ou ao Cabo Adaptador, caso o mesmo esteja sendo utilizado.

O módulo ligará assim que for conectado ao conector de diagnóstico do veículo, se este
possuir alimentação. Se não ligar e estiver sendo utilizado um Cabo Adaptador, utilize o Cabo de
Alimentação via Acendedor de Cigarro ou o Cabo de Alimentação via Bateria tipo Jacaré para conectar o
cabo acendedor à tomada de energia 12V ou as garras jacaré à bateria do veículo.


MANUAL DE OPERAÇÃO


**NOTA: AO UTILIZAR-SE O CABO DE ALIMENTAÇÃO VIA BATERIA TIPO JACARÉ,**
**ACONSELHA-SE QUE O OPERADOR EXECUTE PRIMEIRO A LIGAÇÃO DO CABO DE**
**ALIMENTÇÃO NA BATERIA DO VEÍCULO E, APÓS ISSO, FAÇA A LIGAÇÃO NO CONECTOR DO**

**CABO ADAPTADOR.**


**NÃO INVERTER A POLARIDADE DA CONEXÃO. NO PROCESSO DE**
**DIAGNÓSTICO, O MÓDULO DEVE SER ALIMENTADO PELO VEICULO.**

**CERTIFIQUE-SE QUE OS ENCAIXES ESTÃO BEM FEITOS E QUE A**

**TENSÃO DA BATERIA DO VEÍCULO ESTÁ CORRETA.**


**3.2 – SELECIONANDO O VEÍCULO**


Ao ligar o equipamento, aparecerá a seguinte mensagem:


**SISTEMA INTEGRADO**

**DE DIAGNÓSTICO E**
**REPARAÇÃO AUTOMOTIVA**

**VERSÃO: XX.XX**


Em seguida, será apresentado o menu de opções:


**Função:**
 **Scanner Auto**


**Scanner Diesel**

**Configurações**


Selecione o teste desejado navegando pelos menus:


Exemplo: Injeção da Alfa Romeo 145 2.0 16V


**Função:**
 **Scanner Auto**


**Scanner Diesel**

**Configurações**


**Veículo:**

 **ALFA 145**

**ALFA 155**

**ALFA 164**


MANUAL DE OPERAÇÃO


**Modelo:**

 **2.0 16V**


**Sistema:**

 **ABS BOSCH 2E**

 **MOTRONIC 2.10.3**


Após selecionar o teste, se este não estiver disponível, irá apresentar a tela:


**Opção não Liberada!!**

**Adquira PACK ou**
**Utilize os créditos.**


**Continuar**


Se o teste estiver disponível, será mostrado o adaptador que deve ser utilizado. Para
continuar, pressione RETORNA.


**3.3 – MODOS DE OPERAÇÃO**


Após a seleção do sistema e a edição da placa do veículo, será apresentado o cabo a ser
utilizado. Após isso, a seguinte tela será apresentada:


**Selecione o Modo:**


**T    C    U    I**




**Modo: Teste**


NOTA: Pode haver diferenças na tela dependendo do teste selecionado.






MANUAL DE OPERAÇÃO


**3.3.1 – MODO TESTE**


Esta opção é acessada ao teclar “ENTRA” quando a seta está abaixo da letra T. Neste modo é
possível realizar a leitura de falhas memorizadas pela unidade de comando, executar testes de atuadores
e ainda realizar ajustes no sistema, como mostrado abaixo:


 **002/003** 

**COD: 012 - Falha na**

**Bomba de Combustível**


**RETORNA para** **sair**


Atuadores: Esta opção é utilizada para verificar o funcionamento de alguns componentes do
sistema que está sendo testado. O módulo solicitará à unidade de comando que atue o componente
selecionado. A verificação do funcionamento é constatada, em geral, de forma auditiva e visual.


Modo Ajustes: Esta opção é utilizada para realizar adaptações e/ou ajustes disponíveis no

sistema testado.


**3.3.2 – MODO CONTÍNUO**


Pelo modo contínuo são visualizados os parâmetros de funcionamento adotados pela unidade de
comando em tempo real. Para os sistemas de gerenciamento do motor há duas formas de visualização
destes parâmetros. É possível a visualização com a função VisualGraph ou sem.


Ao selecionar a opção Modo Contínuo, a seguinte tela será apresentada:


**Atenção !!!**
**Deseja VisualGraph?**


**Sim**   **Não**

**Modo: Contínuo**






MANUAL DE OPERAÇÃO


Modo Contínuo sem VisualGraph:

Neste modo, são visualizados dois parâmetros por tela. Abaixo segue um exemplo:


**ROTAÇÃO DO MOTOR**


**1000 RPM**

**ESTADO DO MOTOR**


**ligado**


Para visualizar outros parâmetros, utilize as teclas “” e “”. É possível fixar um parâmetro
enquanto navega-se pelos outros parâmetros. Para isso, utilize as teclas “” e “”. Quando um
parâmetro estiver fixo, aparece um “*” no canto esquerdo da tela ao lado do valor do parâmetro que está

fixo, como mostrado abaixo:


**ROTAÇÃO DO MOTOR**

***     1000 RPM**


**ESTADO DO MOTOR**


**Ligado**


Para que o parâmetro deixe de ser fixo, basta utilizar as setas “” e “” novamente.


Modo Contínuo com VisualGraph:


Está opção só está disponível para sistemas de gerenciamento de motor. Antes de iniciar a
exibição dos parâmetros, aparecerá uma mensagem informando que as faixas de referência são válidas
para o motor com temperatura do líquido de arrefecimento acima de 80ºC e na condição de marcha-lenta.
A tela apresentada durante a operação com VisualGraph é similar à seguinte:


     RPM: 960     

**800**   **1000**

**||||||||||||||**


**Mín: 900    Máx: 1040**


MANUAL DE OPERAÇÃO


Na primeira linha observa-se nos cantos direito e esquerdo dois símbolos de direção,
sinalizando ao operador que, para visualizar outro parâmetro, basta acionar as teclas “” e “”. No

centro da primeira linha é apresentado o título do parâmetro em análise e seu valor atual.

Na segunda linha são apresentadas duas setas apontadas para baixo, ao lado dos valores
mínimo e máximo, a fim de demarcar e servir como referência na escala de barras, que é montada na
terceira linha. Essa última simboliza graficamente os valores fornecidos pela unidade de comando.

Os valores mínimos e máximos são apenas para referência. Valores fora dessa faixa não
significam necessariamente problemas no veículo, ou valores dentro da faixa não indicam ausência de

defeitos.


Na quarta linha da tela do VisualGraph são apresentados os valores mínimo e máximo lidos,
ou seja, no exemplo acima, o valor mínimo lido pelo equipamento foi de 900 RPM. Da mesma forma o

valor máximo lido foi de 1040 RPM.


Para sair do modo VisualGraph, basta teclar “RETORNA”.


**3.3.3 – MODO UNIDADE DE COMANDO**


No Modo Unidade de Comando, o equipamento disponibiliza as funções de apagar a memória
e visualizar o número ou código de referência da unidade de comando do sistema testado.

Dependendo do sistema testado, também é possível realizar programações na unidade de
comando. Nem todo sistema que está sendo testado possui estas funções disponíveis.

**3.3.4 – MODO INFORMAÇÕES**


Neste modo está disponível o relatório do teste executado.


**Informações:**

**D     I**



**Modo: Display**


MANUAL DE OPERAÇÃO


Modo Display:

O Modo Display apresenta um relatório de informações no display do módulo. Através das
teclas de direção “” ou “”, é possível ter acesso às informações que estão contidas neste modo.
Abaixo, temos um exemplo de relatório apresentado:


**Informações Display:**

 **Sistema:** 


**ME 7.9.6**


As informações apresentadas serão: linha, sistema, versão do software, automóvel, placa,

resultado dos testes de falhas e nome da oficina. Para visualizar o resultado dos testes o usuário deve

selecionar “Teste” e teclar “ENTRA”. Para sair do modo Display, basta teclar “RETORNA”.


**3.4 – SELEÇÃO DO MESMO VEÍCULO**


Após um teste, ao pressionar a tecla RESET, a seguinte tela é apresentada (certifique-se que
o cabo de operação PC NÃO esteja conectado):


**Atenção!**

**Outro Veículo?**

**Não          Sim**


**ALFA 145 2.0 16V**


Selecione NÃO se desejar repetir o teste ou se deseja realizar outro teste, porém com o

mesmo veículo.


MANUAL DE OPERAÇÃO


**Atenção!**

**Outro Sistema?**

**Não          Sim**


**ALFA 145 2.0 16V**


Selecione NÃO se desejar repetir o teste.


**NOTA:** **ESSA OPÇÃO É MUITO IMPORTANTE SE O USUÁRIO ESTIVER UTILIZANDO**
**CRÉDITOS E DESEJAR REPETIR O TESTE. MAIS INFORMAÇÕES SERÃO ABORDADAS NO**
**CAPÍTULO “OPERAÇÃO COM CRÉDITOS”.**


**IMPORTANTE:**
**TODAS AS INFORMAÇÕES APRESENTADAS PELO EQUIPAMENTO SÃO**

**COLETADAS DA UNIDADE DE COMANDO ELETRÔNICO (UCE) DO**
**VEÍCULO. ESSAS INFORMAÇÕES DEVEM SER USADAS SOMENTE**

**COMO AUXÍLIO NO DIAGNÓSTICO DO VEÍCULO. NÃO NOS**

**RESPONSABILIZADOS POR QUALQUER PERDA OU DANO CAUSADO**


**POR USO INDEVIDO.**


**3.5 – DIAGNÓSTICO VIA PC**


Ao conectar o cabo USB, o módulo detectara automaticamente esta condição e entrará em
Modo Diagnostico via software no PC ou tablet Windows 7 ou superior.


**3.6 – CONEXÃO VIA BLUETOOTH**


Verifique na etiqueta com o número de série do equipamento o nome para o pareamento do
bluetooth. Ele está indicado como BT-XXXXXX. A senha para pareamento é 1234.


MANUAL DE OPERAÇÃO


**3.7 – FUNÇÃO RDS**


A Função RDS (Road Diagnosis System), que é um opcional e é vendida separadamente, tem
como finalidade detectar falhas intermitentes no veículo. Para se fazer uso desta função, o operador deve
conectar o módulo ao computador PC ou tablet Windows 7 ou superior e, através do Software RDS,
selecionar o veículo, o sistema do veículo (transmissão automática ou injeção eletrônica) e os parâmetros
desejados a serem levantados pelo módulo, sendo possível a escolha de até 8 parâmetros disponíveis
para transmissão automática ou injeção eletrônica, quando as mesmas estiverem disponíveis no veículo.

Após a configuração via o software, o módulo deve ser conectado ao conector de diagnóstico
do veículo e o operador deve rodar com o veículo para que o módulo possa fazer a leitura e gravação dos
parâmetros selecionados e das possíveis falhas levantadas no veículo. Por fim, o módulo deve ser
novamente conectado ao computador ou tablet, para que, através do Software RDS, o operador possa
analisar os dados levantados.


**ATENÇÃO: EVITE DEIXAR O MÓDULO CONECTADO AO VEÍCULO SEM QUE O MESMO**
**ESTEJA LIGADO, POIS PODERÁ OCORRER O DESCARREGAMENTO DA BATERIA DO VEÍCULO**
**DEPENDENDO DO TEMPO DE CONEXÃO COM O VEÍCULO DESLIGADO.**


**A FUNÇÃO RDS, QUE INCLUI O SOFTWARE RDS PARA CONFIGURAÇÃO**

**E ANÁLISE DE DADOS, É VENDIDA SEPARADAMENTE.**


**4 – OPERAÇÃO COM CRÉDITOS**


Após entrar com os créditos no equipamento, ao selecionar o teste que não esteja liberado
apresentará a mensagem:


**Opção não Liberada!!**


**Usar os Créditos?**


**XXX**

**Não            Sim**


**ATENÇÃO: Após o teste, se o operador reiniciar o equipamento e selecionar que deseja**
**testar o mesmo veículo e executar o mesmo teste, não será descontado um outro crédito. Esse**

**procedimento é muito importante se, no meio do teste, a alimentação do equipamento for**
**interrompida e for necessário reiniciar o procedimento de teste.**


MANUAL DE OPERAÇÃO


**5 – LIBERAÇÃO**


Para a digitação de senhas de liberação, revisão, créditos e upgrade, o usuário deverá fazer uso
do Software IDE do equipamento, disponível no CD que acompanha o produto ou fazer o download do
site do fabricante.


**6 – CUIDADOS GERAIS E RECOMENDAÇÕES**


Como todo equipamento eletrônico, o módulo tem alguns itens de seu conjunto que requerem
atenção e cuidado com relação a quedas e impactos. A limpeza do equipamento deve ser feita com pano
umedecido (quase seco) em água e, se necessário, utilizar sabão ou detergente neutro para remover
resíduos de graxas e crostas de sujeira. O módulo não deve ser lavado com água corrente. Embora a
máscara dos controles seja impermeável, a água pode escorrer pelas bordas do console e atingir as
placas eletrônicas que se localizam no interior do aparelho.


Pontos que devem ser observados:

  - Cuide bem do equipamento, pois assim ele sempre estará em condições de ajudá-lo a realizar
o diagnóstico nos veículos.

  - Mantenha o módulo em lugar seguro para evitar quedas.

  - Havendo dúvidas de operação, procure orientação no Manual de Operação ou consulte o

Atendimento Técnico da Alfatest.

  - Não use nenhum tipo de líquido, que não seja água e sabão ou detergente neutro, para limpar
o módulo. Não utilize água em excesso, apenas um pano levemente umedecido. Limpeza com
álcool etílico também poderá ser realizada em casos extremos.

  - Não empilhe outros aparelhos sobre o equipamento.

  - Não tente reparar o equipamento.

  - Não use o equipamento fora das especificações elétricas e ambientais descritas no Manual de
Operação.


**NOTA: CASO SE UTILIZEM OUTROS MATERIAIS PARA LIMPEZA DO EQUIPAMENTO,**

**COMO POR EXEMPLO, TINNER, GASOLINA, SOLVENTES EM GERAL, REMOVEDOR, ETC.,**
**PODERÁ OCORRER A REMOÇÃO DE TINTA DO MESMO.**


**7 –** **ATENDIMENTO AO CLIENTE E ASSISTÊNCIA TÉCNICA**


Caso ocorram dúvidas de operação durante o uso do equipamento, a Alfatest coloca à
disposição dos usuários um número de telefone onde as dúvidas poderão ser esclarecidas e para as


MANUAL DE OPERAÇÃO


chamadas para Assistência Técnica. O processo de Atendimento Técnico é realizado por um profissional
habilitado da Alfatest que irá realizar um procedimento junto ao usuário com o objetivo de filtrar o
problema apresentado pelo mesmo e esclarecer se é causado por falha na operação ou se é um
problema de funcionamento do equipamento.


**ATENÇÃO:**
**COM O INTUITO DE PRESTAR O MELHOR ATENDIMENTO AOS**
**SEUS CLIENTES, A ALFATEST MANTÉM ARQUIVADOS TODOS OS**

**DOCUMENTOS RELACIONADOS AOS ATENDIMENTOS DE SUPORTE**
**TÉCNICO E DE ASSISTÊNCIA TÉCNICA REALIZADOS, OS QUAIS SÃO**


**VINCULADOS AO CADASTRO DO CLIENTE PERANTE A ALFATEST.**

**SUGERIMOS AOS CLIENTES QUE TAMBÉM GUARDEM OS**

**DOCUMENTOS RELACIONADOS A ATENDIMENTOS DE SUPORTE**

**TÉCNICO E DE ASSISTÊNCIA TÉCNICA SOLICITADOS E/OU**

**EFETIVAMENTE PRESTADOS PELA ALFATEST, EIS QUE ESTES**
**PODERÃO SER SOLICITADOS FUTURAMENTE. COM A EFETIVA**
**GUARDA DAS SOLICITAÇÕES E DE DOCUMENTOS QUE COMPROVEM**
**OS CONTATOS REALIZADOS, O ENVIO DE EQUIPAMENTO À ALFATEST**

**E/OU PRESTAÇÃO DE SERVIÇOS DE ASSISTÊNCIA TÉCNICA E/OU**

**SUPORTE TÉCNICO REMOTO, OS SERVIÇOS PRESTADOS PELA**

**ALFATEST PODERÃO SER APRIMORADOS.**


MANUAL DE OPERAÇÃO


**8 – ESPECIFICAÇÕES TÉCNICAS**


**ALIMENTAÇÃO:**
Tensão 9 a 30 V (DC)


Consumo 450 mA

**CONDIÇÕES AMBIENTAIS:**

Temperatura

Operação 0 a 50 °C
Armazenagem -20 a 60 °C


**DIMENSÕES E PESO:**

**Caixa:**


Altura 195 mm

Largura 245 mm

Profundidade 80 mm


**Módulo:**

Altura 53 mm

Largura 120 mm
Comprimento 211 mm
Peso 520 g


**9 – TERMO DE GARANTIA**


A ALFATEST INDÚSTRIA E COMÉRCIO DE PRODUTOS ELETRÔNICOS S.A. (fabricante),
em complementação aos direitos que são assegurados por lei ao consumidor, dentro dos prazos e limites
abaixo descritos e desde que não ocorra qualquer dos fatos adiante enumerados como excludentes de
garantia, garante o produto, obrigando-se a reparar ou substituir as peças que, em serviço e uso normal,
apresentarem defeitos de fabricação ou de material.

**9.1 – EQUIPAMENTO**

**Prazo de garantia:**
Três meses de garantia legal mais nove meses de garantia estendida (contados a partir da data da nota
fiscal de venda).


MANUAL DE OPERAÇÃO


**A garantia estará cancelada se:**

  - O equipamento for submetido a abusos ou acidente provocado por queda ou choque

mecânico.

  - O equipamento for submetido a características elétricas ou ambientais fora dos limites
especificados no Manual de Operação (tensão da rede elétrica, temperatura do ambiente de
operação, etc.)

  - Não forem respeitadas as recomendações descritas no item “Cuidados Gerais e
Recomendações” do Manual de Operação do equipamento.

  - O equipamento for reparado fora de empresas autorizadas pelo fabricante.

  - Os componentes originais, peças, acessórios e opcionais do equipamento forem alterados ou
substituídos por outros não fornecidos pelo fabricante.

**Itens não cobertos pela garantia:**


  - Peças que se desgastam pelo uso normal ou natural.

  - A garantia das peças substituídas no equipamento, durante o período de garantia, finda com a
garantia do equipamento.


**9.2 – SOFTWARE**


Embora tenham sido tomadas todas as precauções possíveis para garantir a exatidão e
plenitude das informações incluídas no software do equipamento, o fabricante não pode garantir que o
próprio software esteja sempre em conformidade com os requisitos específicos do cliente, que possa
funcionar por um período ilimitado de tempo ou que esteja totalmente isento de imprecisões. Isso também
se deve ao fato de os dados incluídos nos programas ou nas bases de dados serem provenientes de

fontes diferentes.


O fabricante garante que o software tem a capacidade de efetuar as operações a que se
destinam, indicado nas descrições técnicas relacionadas com os programas. O software tem uma
garantia de 01 (um) ano, sendo três meses de garantia legal, mais nove meses de garantia adicional, a
contar da data de ativação e está sujeito à utilização correta do sistema pelo licenciado. Salvo disposição
jurídica em contrário, o fabricante não oferece nem reconhece qualquer outra garantia.

Esta garantia não cobre problemas de conflito de software quando instalado em plataformas
de hardware diferentes das especificadas pelo fabricante (isto é, computadores pessoais PC, PCs de
bolso, PCs tablet, com sistema operacional Windows 7 ou superior). A garantia não cobre anomalias
causadas por incompatibilidade entre os programas do fabricante e ambientes de software já danificados
por vírus, não protegidos por um sistema antivírus e ambientes suportados por fontes de hardware

inadequadas.


MANUAL DE OPERAÇÃO


**ATENÇÃO:**
**AS ATUALIZAÇÕES DE SOFTWARE SERÃO COBRADAS.**


**O SOFTWARE REALIZA O DIAGNÓSTICO DOS SISTEMAS ELETRÔNICOS**
**EMBARCADOS INCLUSOS NOS PACOTES (PACKS) QUE FAZEM PARTE DA**

**CONFIGURAÇÃO DO PRODUTO ADQUIRIDO. PORTANTO, CABERÁ AO**
**CONSUMIDOR CONSULTAR A RELAÇÃO DE PACKS ABRANGIDAS PELA**

**CONFIGURAÇÃO DO SEU EQUIPAMENTO.**


**CASO O CONSUMIDOR TENHA INTERESSE EM ADQUIRIR PACKS QUE NÃO**

**CONSTAM DA CONFIGURAÇÃO ORIGINAL DO EQUIPAMENTO ADQUIRIDO,**
**DEVERÁ EFETUAR A COMPRA DO PACK DESEJADO DE FORMA AUTÔNOMA.**


**ATENÇÃO:**
**O DIAGNÓSTICO DE VEÍCULOS FABRICADOS HÁ MAIS DE 10 (DEZ)**

**ANOS PODE ESTAR SUJEITO A INSTABILIDADES DE SOFTWARE EM**
**FUNÇÃO DE INSTABILIDADES DE COMUNICAÇÃO OCASIONADAS POR**

**INCONSISTÊNCIAS DE ATERRAMENTO E/OU TOLERÂNCIAS DE**
**COMPONENTES ELETRÔNICOS DO SISTEMA DE GERENCIAMENTO**

**ELETRÔNICO DO VEÍCULO.**


**9.3 – LOCAL DE EXECUÇÂO DAS REPARAÇÕES COBERTAS PELA GARANTIA**

Todas as reparações cobertas pela garantia, salvo indicação em contrário através de acordo
por escrito, serão executadas na sede do fabricante ou, quando for indicado pelo fabricante, em um posto
autorizado de assistência técnica do fabricante, correndo todos os custos de transporte de envio e retorno
do produto por conta do cliente.


**9.4 – TRANSPORTE**


A garantia do fabricante não cobre danos devido a transporte ou embalagem incorretamente
acondicionada pelo cliente para envio dos produtos a reparar. O envio de qualquer produto ou
componente a reparar tem de ser previamente acordado com o fabricante ou, quando for indicado pelo
fabricante, com o posto autorizado de assistência técnica do fabricante. Se o produto não funcionar
corretamente ou apresentar defeito, contate o fabricante.


MANUAL DE OPERAÇÃO


**ATENÇÃO:**
**PARA A SOLICITAÇÃO DE SERVIÇOS EM GARANTIA, É NECESSÁRIA A**

**APRESENTAÇÃO DA NOTA FISCAL DE COMPRA DO PRODUTO.**


**9.5 – LICENÇA DE USO DE SOFTWARE - DIREITOS DE AUTOR**


O software do equipamento está protegido por direitos autorais. A propriedade e
comercialização dos programas contidos no equipamento são direitos exclusivos do fabricante, estando
protegidos pela Lei n° 7.646/87, ficando o seu infrator sujeito às penalidades de ordem criminal.


Alfatest Indústria e Comércio de Produtos Eletrônicos S.A.

Av. Presidente Wilson, 3009 - Ipiranga - CEP. 04220-000 - São Paulo/SP - Brasil

Tel: (11) 2065-4700 - FAX: (11) 2065-3146
E-mail: vendas@alfatest.com.br - Site: http://www.alfatest.com.br


