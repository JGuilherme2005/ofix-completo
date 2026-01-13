# Manual-NA9000E_V430_Operacao

# **_SIAD/NA-9000 E_**

### **_Sistema de Inspeção Ambiental do Despoluir._** **_Analisador de Opacidade._** **_Versão 4.32  CNT_**

## **_Manual de Instalação_** **_e_** **_Operação_**

_**Versão: 4.32K/19**_


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Copyright 2019 por Napro Eletrônica Industrial LTDA.

Todos os direitos reservados.

Proibida a reprodução dos textos, gráficos ou imagens contidas neste manual,
mesmo parciais, e por qualquer processo atual de cópia ou que por ventura seja
inventado. Sem prévia autorização por escrito da Empresa.

A Napro Eletrônica Ind. LTDA se reserva o direito de realizar qualquer alteração
relativa ao manual e ao produto, assim como suas características técnicas, sem a
necessidade de uma informação prévia.

Nomes de produtos utilizados neste manual com o propósito de identificação são
marcas registradas dos seus respectivos fabricantes. A Napro declina de todo e
qualquer direito sobre estas marcas.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 2


#### **_SIAD/NA-9000E_**

**Manual de Instalação**

###### **Índice:**


_OBSERVAÇÕES IMPORTANTES: ..................................................................................................... 4_


_**1.**_ **Introdução: ........................................................................................................................................................ 6**


_**2.**_ **Instalando o Equipamento: .............................................................................................................................. 7**


_2.1. Instalando o Conversor USB/Serial: ......................................................................................................... 7_


_2.2. Instalando o Medidor de RPM MGT300: ................................................................................................... 8_


_3.3_ _. Instalando o Driver para o rádio Bluetooth: ....................................................................................... 8_


_2.4. Instalando o Software de Controle NA9000E:........................................................................................... 9_


_2.5. Instalando o Equipamento: ...................................................................................................................... 16_


_**3.**_ **Utilizando o Software de Controle NA9000E Despoluir: ............................................................................ 23**


_3.1. Primeira Utilização: ................................................................................................................................. 25_


_3.2. Configuração Avançada: ......................................................................................................................... 28_


_3.3. Menu de Entrada: .................................................................................................................................... 34_


_3.4. F3 – Veículos Cadastrados: .................................................................................................................... 35_


_3.5. F5 – Transportadores Atendidos: ............................................................................................................ 38_


_3.6. F5 – Relatórios: ....................................................................................................................................... 40_


_3.7. F6 – Configuração: .................................................................................................................................. 42_


_3.8. F7 – Limites para Modelos: ..................................................................................................................... 49_


_3.9. F10 – Logoff Técnico: ............................................................................................................................. 52_


_3.10. F1 – Novo Teste: ................................................................................................................................... 52_


_3.11. F2 – Teste Demonstração: .................................................................................................................... 65_


_3.12. F12 - Sair:.............................................................................................................................................. 66_


_**4.**_ **Manutenção: ................................................................................................................................................... 67**


_**5.**_ **Especificações:................................................................................................................................................. 68**


_**6.**_ **Garantia: ......................................................................................................................................................... 69**


**8** **- ANEXO 1: Impressão no Formato PDF. .................................................................................................... 71**


**9** **- ANEXO 2: CÓDIGOS DE ERRO............................................................................................................... 72**


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 3


#### **_SIAD/NA-9000E_**

**Manual de Instalação**

####  **OBSERVAÇÕES IMPORTANTES:**


**O analisador de opacidade NA9000P é alimentado por tensão contínua**
**fornecida por um conversor AC/DC (fonte de alimentação) ou através da**
**bateria do veículo, para evitar problemas com a polaridade da**
**alimentação (positivo ou negativo) o equipamento possui um fusível de**
**proteção localizado na parte dianteira do equipamento. Caso ocorrer a**
**queima do fusível o equipamento não irá funcionar. Substitua apenas por**
**um fusível do mesmo modelo e amperagem do original:**


**Fusível rápido 3,5A 250VAC 20 mm**

**Não utilize nenhum outro modelo, pois ocorrerá a queima do**
**equipamento. Não coberto pela garantia. A Napro se reserva o direito de**
**não fornecer garantia ao equipamento no caso da queima por fusível não**
**compatível.**


**O Analisador NA9000P é alimentado com uma tensão contínua de 11 à**
**24Vdc, podendo ser utilizada em qualquer veículo com estas tensões.**


**Oequipamento NA9000P possui a opção de comunicação entre o PC e o**
**opacímetro através de um sistema sem fio (wireless) Bluetooth. Este**

**sistema é composto de um receptor incorporado ao equipamento e um**
**transmissor, o qual é ligado ao PC ou notebook. O TRANSMISSOR E O**
**RECEPTOR SÃO UM CONJUNTO E SÓ FUNCIONAM ENTRE SI, O**
**TRANSMISSOR SOMENTE IRÁ FUNCIONAR NO EQUIPAMENTO DE**
**NÚMERO DE SÉRIE ESCRITO EM SUA ETIQUETA.**

**Apenas conecte o transmissor do sistema sem fio após a instalação do**
**driver, caso for efetuada antes o transmissor não funcionará**
**corretamente em todas as portas USB**


**Cuidado ao manusear a sonda de captação de gases, como está em**
**contato com o escapamento do veículo pode possuir uma temperatura**
**elevada.**


**Antes de realizar uma medição se certifique que o módulo de medição**
**esteja alimentado e todos os equipamentos interligados. O sistema irá**
**realizar uma verificação para identificar os equipamentos conectados.**


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 4


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


**Se o PC ou notebook possuir programa antivírus ou de proteção ao**
**acesso não autorizado na internet (por exemplo, Internet Security),**
**alguns processos programas poderão ser bloqueados e não iram**
**funcionar, por favor, ao iniciar o programa, durante a instalação do**
**programa ou durante o boot do Windows se aparecer algum aviso para**
**confirmação de liberação de algum programa para acesso à internet ou**
**rede, confirme o acesso para evitar problemas de funcionamento do**
**sistema.**

**Apenas introduza a sonda de captação de gases no escapamento no**
**momento em que o software solicitar.**


**No** **final** **do** **ensaio** **RETIRE** **A** **SONDA** **DE** **CAPTAÇÂO** **DO**
**ESCAPAMENTO DO VEÍCULO.**

**Não enrole a ponteira da sonda do escapamento, ela é produzida com**
**aço e apesar de possuir uma flexibilidade não deve ser guardada**
**enrolada.**


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 5


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


_**1.**_ **Introdução:**


O NA-9000E é composto de um Opacímetro de última geração, destinado
à medição da fumaça de gás de escapamento em veículos do ciclo Diesel,
através da absorção da luz. Devido às mudanças tecnológicas mais recentes o
NA9000E é fornecido com o banco de opacidade NA9000P.


Através de um Software de Controle o usuário pode verificar as medidas
do equipamento.


O software foi desenvolvido para o sistema operacional W98, W98SE,
2000 e XP, Windows 7 ou Windows 10.


O **NA9000P** é uma ferramenta fundamental para a medição da fumaça de
gás de escapamento em veículos do ciclo Diesel.


O Opacímetro utiliza o principio de absorção luminosa de uma fonte de luz
com comprimento de onda específico, em função da quantidade de fumaça
emitida pelo veículo do ciclo Diesel.


Este manual contém todas as informações necessárias para o correto
manuseio do equipamento, desde como configurar o seu NA9000P até como
resolver algum possível problema que venha a acontecer com o seu
equipamento no decorrer do tempo.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 6


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


_**2.**_ **Instalando o Equipamento:**


Para não encontrar dificuldades na instalação, siga rigorosamente as
instruções deste manual, seguindo a seqüência de instalação. Desta forma a
instalação será fácil e rápida.


**2.1. Instalando o Conversor USB/Serial:**


Alguns computadores portáteis não saem de fábrica com uma porta de
comunicação serial nativa ao equipamento.


Como o equipamento NA9000E necessita de uma porta de comunicação
serial padrão RS232, é fornecido opcionalmente com o equipamento um cabo
conversor USB/Serial e o respectivo software.


Várias marcas podem ser usadas para realizar a comunicação com o
equipamento, mas não garantimos o funcionamento de todas, algumas
podem apresentar falhas na comunicação.


O cabo conversor, quando fornecido, é enviado junto com os drivers de
instalação para o Windows XP e versões posteriores, para versões mais do
Windows mais antigas entre em contato para adquirir o drive correto.


Antes de realizar a instalação do software, é recomendado, instalar o
conversor USB/Serial, para tanto coloque o CD de instalação do programa no
drive de CD, ignore a instalação do software SIAD - NA9000E, através do
Windows Explorer ou de Meu Computador, selecione o drive de CD e procure
a pasta “USB Serial”, dentro desta pasta será encontrado o arquivo
“Driver_TU-S9_Win2003“este é um arquivo executável, selecione este
arquivo e siga o processo de instalação confirmando todas as opções. Este
arquivo também pode ser encontrado na pasta Driver no diretório da Napro,
no caminho C:\Napro\NA9000E\Driver.


Ao término do processo o computador portátil possuirá os drivers
necessários para o cabo conversor USB/Serial funcionar.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 7


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Coloque o cabo em alguma entrada USB do seu computador e
aguarde o Windows reconhecer o novo hardware instalado. Após esta
operação, sempre que conectar o cabo neste computador o Windows o
reconhecerá automaticamente, em qualquer porta USB deste computador.


Lembrando que para a instalação de alguns periféricos é necessário
possuir privilégios de administrador no Windows.


**2.2. Instalando o Medidor de RPM MGT300:**


O equipamento opcional Medidor de RPM MGT300, é um equipamento
utilizado para a medição da rotação do motor através do sinal da bateria do
veículo.


Ele pode ser ligado em baterias de 12 ou 24Vdc.

No sistema NA9000E Despoluir, o medidor de RPM MGT300 é conectado
ao sistema através de uma interface sem fio (Wireless).


Siga as instruções do manual do medidor de RPM MGT300 para
realizar a medição de rotação do motor.


Para o perfeito funcionamento do medidor se faz necessário a instalação
dos arquivos de sistema (driver´s) correspondentes ao sistema de comunicação
sem fio Bluetooth que acompanham o equipamento.


**3.3.** **Instalando o Driver para o rádio Bluetooth** **:**


O driver para o adaptador USB/Serial Bluetooth é instalado durante a
instalação principal do software no computador, tenha o cuidado para não
conectar o rádio bluetooth antes de instalar o software.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 8


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


**2.4. Instalando o Software de Controle SIAD/NA9000E:**


O usuário poderá utilizar o CD de instalação que acompanha o
sistema, para realizar a instalação do SIAD, mas é altamente recomendável
realizar a instalação inicial realizando o download do arquivo instalador direto
do site de suporte do programa, no endereço:
##### https://www.despoluir.napro.com.br


Neste site o usuário poderá encontrar informações, serviços e
downloads do sistema SIAD.

Na Base de Conhecimento entre no artigo “Link para baixar o
programa executável”. Como demonstrado abaixo:


Clique no link e siga as instruções de download.
Após o fim do download execute o arquivo de instalação. O arquivo de
instalação deverá ter um nome parecido com:

###### setup_despoluir_4_30.exe


A versão do software de instalação está no nome do arquivo.

Na opção de se executar do CD, com toda certeza uma versão mais
antiga do software irá ser instalada necessitando posteriormente realizar a
atualização, neste caso coloque o CD com o programa de instalação no leitor
de CD-ROM. Após alguns segundos o programa de instalação deverá abrir
automaticamente.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 9


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Caso o programa não seja executado automaticamente clique em
“Meu Computador” na área de trabalho e selecione o seu leitor de CD-ROM e
de um duplo clique no programa Instalar.exe.

O programa de instalação será executado no seu computador.


Clique em Instalar para iniciar a instalação.


E confirme com OK ou Yes quando o programa de instalação solicitar
alguma confirmação.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 10


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Alguns driver´s ou software poderão ser instalados junto com a
atualização ou instalação, se tiver dúvida sobre se o respectivo driver tiver
sido instalado, confirme para reinstalar.


Caso seja solicitado a reiniciar o computador antes do final da
instalação (Exemplo abaixo), ignore (clique em Não) e termine a instalação
primeiro.


O sistema irá instalar automaticamente o driver para o equipamento
MGT-300 EVO, clique em Install.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 11


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Se na instalação do driver do MGT-300 EVO, aparecer uma tela
informando que o driver não é certificado, ignore e selecione a opção “Instalar
este software de driver mesmo assim”.


Termine a instalação do driver do MGT-300 EVO clicando em Finish.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 12


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Ao final da instalação o programa solicitará, reiniciar o computador,
para que as modificações efetuadas possam ter efeito.


Aguarde antes de reinicilaiza, pois o instalador irá executar o instalador
de captura de imagens pertencente ao CNT.


Também poderá ser escolhida a opção Não, eu vou reiniciar o
computador depois. E após a instalação do software de captura de imagens
do CNT reinicializar o computador manualmente.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 13


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


O instalador iniciará a instalação do software de captura de imagem do
CNT.


Caso o sofwtare de captura do CNT, não for instalado, apresentando
erro durante o teste, o usuário poderá realizar a instalação ou reinstalação
utilizando o software contido na pasta C:\NAPRO\NA9000E\Driver chamado
de “CameraControlCNT_Install.msi”.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 14


#### **_SIAD/NA-9000E_**

**Manual de Instalação**

Clique em avançar para realizar a instalação.

Não modifique o diretório de instalação padrão.


Clique em Avançar e em Avançar novamente.


Aguarde a instalação do software.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 15


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Clique em Fechar para finalizar a instalação do software.

Reinicialize o computador.


Para executar o programa de controle do NA-9000E, mova o cursor do
mouse até o ícone **SIAD – NA9000E DESPOLUIR** e de um duplo clique sobre

o mesmo.


**2.5. Instalando o Equipamento:**


A instalação do Analisador de Opacidade NA9000P é simples e não
requer nenhuma dificuldade técnica.


O equipamento possui dois cabos de ligação, um de comunicação e
outro de alimentação, e uma sonda de captação de gases.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 16


#### **_SIAD/NA-9000E_**

**Manual de Instalação**

Basicamente o opacímetro necessita apenas de alimentação elétrica,
existe duas formas de realizar esta alimentação elétrica. Através de uma
fonte alimentação ou pela bateria do veículo.


Ligue a fonte de alimentação à rede elétrica de 110 ou 220 Vac e
conecte o cabo de alimentação ao opacímetro.


**O CABO DE ALIMENTAÇÂO E O CABO DE COMUNICAÇÂO**
**POSSUEM** **CONECTORES** **DIFERENTES** **E** **NÂO** **PODEM** **SER**
**INTERCAMBIÁVEIS.**


Se o usuário preferir pode ligar o opacímetro à bateria do veículo
através do cabo de alimentação jacaré que acompanha o equipamento.


**CONECTE A GARRA JACARÉ VERMELHA NO TERMINAL**
**POSITIVO DA BATERIA E A GARRA JACARÉ PRETA NO TERMINAL**
**NEGATIVO DA BATERIA, A INVERSÃO PODERÁ OCASIONAR A QUEIMA**
**DO EQUIPAMENTO, NÃO COBERTA PELA GARANTIA.**


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 17


#### **_SIAD/NA-9000E_**

**Manual de Instalação**

###### **ATENÇÂO: Caso ocorrer inversão na alimentação, o** **equipamento queimará o fusível de proteção e** **poderá ser danificado.** **ATENÇÂO: O opacímetro NA9000P funciona em** **12Vdc ou 24Vdc do veículo podendo ser utilizado em** **qualquer veículo com esta alimentação.** **ATENÇÂO: CONECTE A GARRA PRETA AO** **TERMINAL NEGATIVO QUE É LIGADO AO CHASSI** **DO VEÌCULO, LIGANDO AO TERMINAL NEGATIVO** **DE UMA DAS BATERIAS QUE É LIGADO AO TERMINAL** **POSITIVO DA OUTRA, PODERÁ OCORRER DANOS AO** **EQUIPAMENTO NÃO COBERTOS PELA GARANTIA.**


A mangueira da sonda de captação de gases deve ser conectada no
módulo de opacidade e a ponteira metálica com o dispositivo de fixação deve
ser inserida totalmente no escapamento do veículo que irá ser medido.

###### **ATENÇÂO: A sonda de captação de gases, apesar de** **ser fisicamente parecida com outros equipamentos,** **não pode ser intercambiada entre os equipamentos,** **cada equipamento deve utilizar a sua respectiva sonda.**


O opacímetro NA9000P possui a opção de comunicação Wireless, isto
é, não necessita de um cabo de comunicação, mas para manter a
compatibilidade pode ser utilizado com um cabo de comunicação serial.


Para o funcionamento da comunicação Wireless é necessária a
colocação de um plug no conector serial do opacímetro, como demonstrado
na figura abaixo:


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 18


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Conecte o plug no conector de comunicação, para que o sistema
Wireless funcione, sem este plug o sistema de comunicação Wireless não
funciona. .


No painel do equipamento além do conector de alimentação (conector
inferior), do conector de comunicação (conector superior) temos o portafusível e uma lâmpada indicando que o equipamento está alimentado e seu
fusível está intacto.


O equipamento NA9000P também pode funcionar utilizando um cabo
de comunicação serial com 10 metros de comprimento, se o PC ou notebook
não possuir conector de comunicação serial deverá ser utilizado um
conversor USB/Serial (prefira pelo conversor USB/Serial fornecido pela
Napro).


Conecte a extremidade que possui o conector circular com o módulo
de opacidade e a extremidade com o conector trapezoidal no computador.


**OBS.:** Alguns computadores não possuem porta serial, portanto será
necessária a utilização de um conversor USB/Serial como descrito no item


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 19


#### **_SIAD/NA-9000E_**

**Manual de Instalação**

2.1. Nesse caso o cabo de comunicação será ligado ao conversor USB/Serial
e este a uma porta USB do computador.


**Posição da antena no módulo de medição de opacidade:**


Na opção de comunicação Wireless do equipamento NA9000P o
módulo de opacidade possui um sistema de comunicação sem fio.


A antena do sistema está posicionada próxima à empunhadura do
módulo de opacidade.


A empunhadura protege a antena, mas deve-se ter extremo cuidado
para não danificar a antena, com o risco de diminuir a distância de
transmissão ou danificar permanentemente o rádio do equipamento, a
garantia não cobre a quebra da antena do equipamento.


**PROTETORES ÓPTICOS NA9000P:**


O opacímetro NA9000P dispõe de dois protetores ópticos
posicionados ao lado da entrada da sonda de gases. Este protetor é
composto de uma janela transparente que evita que a fuligem e particulado
dos gases do escapamento sujem o emissor e receptor do equipamento.

###### **O EQUIPAMENTO COM O OPACÍMETRO NA9000P, NÂO** **PODE FUNCIONAR, SEM QUE OS DOIS PROTETORES** **ÓPTICOS ESTEJAM POSICIONADOS NO EQUIPAMENTO. É**


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 20


#### **_SIAD/NA-9000E_**

**Manual de Instalação**
###### **IMPORTANTE, ANTES DE CADA MEDIÇÂO, VERIFICAR A** **EXISTÊNCIA E POSICIONAMENTO DO PROTETOR ÓTICO.**


O protetor ótico pode ser colocado em qualquer posição desde que a
janela transparente fique dentro da câmera de medição. Ao introduzir o
protetor ótico verifique se ele está posicionado corretamente.


Ao introduzir o protetor ótico percebe-se um encaixe e fixação num
ponto determinado. Sempre verifique o posicionamento correto dos
protetores ópticos.


No capítulo de manutenção temos uma indicação da maneira correta
da limpeza destes protetores ópticos.


_**2.3**_ _**– Conectando a Sonda de Amostra**_

Conecte a mangueira da sonda de amostra na opacímetro, conforme figura
abaixo:


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 21


#### **_SIAD/NA-9000E_**

**Manual de Instalação**
###### **_O OPACIMETRO DEVERÁ SER POSICIONADO PERTO DO_** **_ESCAPAMENTO DO VEÍCULO DE MANEIRA QUE A SONDA DE_** **_CAPTAÇÃO DE GASES ALCANCE O ESCAPAMENTO A SER_** **_MEDIDO E NÃO FIQUE NA DIREÇÃO DOS GASES DE SAÍDA DO_** **_ESCAPAMENTO._** **_A NÃO OBSERVÂNCIA DESTE POSICIONAMENTO DO_** **_OPACIMETRO ACARRETARÁ DANOS AO EQUIPAMENTO QUE NÃO_** **_SERÃO COBERTOS PELA GARANTIA._**


O opacimetro deverá ser posicionado próximo ao escapamento a ser testado
do veículo, de maneira à sonda de captação de gases alcançar o respectivo
escapamento.


É importante observar que o opacimentro nunca, em qualquer condição de
uso, deverá estar posicionado na direção da fumaça do escapamento, inclusive
quando da realização do zero inicial.


O opacimetro posicionado na direção do fluxo dos gases de escapamento
poderá alterar as condições de medição e provocar danos ao opacimetro não
cobertos pela garantia.


A mangueira da sonda de captação de gases não pode ser dobrada, o
opacimetro deverá ser posicionado de maneira a mangueira possuir uma ligeira

curva.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 22


#### **_SIAD/NA-9000E_**

**Manual de Instalação**

###### **_NÃO COLOQUE A SONDA DE CAPTAÇÃO DE GASES NO_** **_ESCAPAMENTO ATÈ QUE O SOFTWARE SOLICITE A OPERAÇÂO._**


A não observância deste aviso poderá acarretar medições incoerentes.

Ao ser solicitado pelo software instale a sonda no escapamento do veículo,
conforme figura abaixo:


**OBSERVE ATENTAMENTE A COLOCAÇÃO DA SONDA NO ESCAPAMENTO.**
**A SONDA DEVE SER COLOCADA E POSICIONADA LONGE DE CURVAS**

**DENTRO DO ESCAPAMENTO.**


_**3.**_ **Utilizando o Software de Controle SIAD - NA9000E Despoluir:**


Quando o software de controle é executado, através do ícone no
desktop, automaticamente o software irá se conectar à Internet, e verificar se
existe alguma atualização para ser recebida.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 23


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Caso uma atualização esteja disponível o software irá solicitar uma
confirmação para realizar o download da atualização.


Confirmando o download, o software de atualização irá abaixar os
arquivos necessários e realizar automaticamente a atualização do sistema.


Ao final da atualização será necessário acionar novamente o ícone do
desktop para inicializar o software.


Se o software já estiver atualizado a janela indicará que esta situação
e o software da aplicação será executado.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 24


#### **_SIAD/NA-9000E_**

**Manual de Instalação**

###### **ATENÇÂO: Como o sistema de atualização** **automática e outras funções como transmissão de** **dados para o Sistema Despoluir exigem a conexão e** **comunicação de dados com a internet é necessário que se o** **usuário possuir softwares de proteção como antivírus e** **firewall, os respectivos softwares devem ser configurados** **para ignorar os softwares da Napro, favor consultar a** **documentação do seu software de proteção.**


Uma janela com o nome e versão do programa é indicada.


Esta janela indica a versão atual do software.

**3.1. Primeira Utilização** **:**


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 25


#### **_SIAD/NA-9000E_**

**Manual de Instalação**

Na primeira instalação o usuário deverá registar o software. O sistema de
registro não permite que o usuário utilize o sistema até realizar o registro do
software.


Para liberar o software encaminhe para a Napro os dados constantes da
janela de Registro.


Forneça os dados do ID de Hardware e o nome ou identificação da
federação/sindicato, ou outro indicativo do usuário.


[Envie estes dados através do site www.despoluir.napro.com.br.](http://www.despoluir.napro.com.br/)


Na tela inicial do site, entre na opção “Enviar Ticket”.

Escolha a opção “Registro do Software”. Preencha todos os dados. Na
opção Motivo do Contato, selecione dúvida técnica.


Em Assunto, informe Registro do Software. Coloque os dados do ID de
hardware e identificação na Mensagem, você pode também enviar um Print da
tela acima.


Aguarde a resposta do suporte da Napro. Ao receber os dados insira no
campo correspondente e clique em Registrar.


Esta operação só será necessária apenas uma vez.


Na primeira utilização do software, no notebook, não existe nenhum
cadastro de gerenciador, operador e técnico.


Consequentemente não existe nenhum login cadastrado.

O usuário deverá realizar o cadastro do administrador do software.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 26


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Na tela inicial, o sistema abrirá a janela de Login.

Como é a primeira utilização o usuário (administrador) deverá utilizar o
seguinte usuário e login:


Usuário: **ADMIN**

Senha: **Admin**

Automaticamente o sistema irá direcionar para a opção “Configuração
Avançada” do menu, onde o usuário poderá realizar o cadastro do Gerenciador,
Operador e Técnico.


Deve-se efetuar o cadastro nesta sequência: Gerenciador – Operador –
Técnico.


Pois o Operador é ligado ao Gerenciador e o Técnico é ligado ao
Operador.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 27


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


**3.2. Configuração Avançada** **:**


Nesta opção o usuário deverá cadastrar os dados de gerenciador, operador
e técnico.


Temos para cada cadastro 3 opções:


O primeiro cadastro deverá ser obrigatoriamente do Gerenciador, clique na
opção F5 – Novo Cadastro.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 28


#### **_SIAD/NA-9000E_**

**Manual de Instalação**

Como não existe nenhum cadastro de gerenciador o equipamento
automaticamente irá criar um cadastro de gerenciador.


O usuário não poderá selecionar inserir um operador, enquanto o
gerenciador não for cadastrado.


Todos os campos com identificação Azul são obrigatórios, também é
recomendável carregar a imagem de logotipo do Gerenciador, arquivo de imagem
com tamanho de 210 x 145 Pixel.


Clique em F2 - Gravar para salvar os dados, o software armazenará as
informações e apagará os dados da janela, para, se necessário introduzir mais
Gerenciadores.


ESC - Sair retorna a tela anterior sem salvar os dados.

F8 – Carregar Imagem, abre uma janela de seleção de arquivo de imagem
para carregar a imagem de logo do gerenciador.


F9 – Apagar Imagem, apaga a imagem de logo do gerenciador.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 29


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Para as configurações serem efetivas devemos usar a opção F2 – Salvar.

Na opção F6 – Alterar Cadastro, a mesma janela de inserção irá aparecer,
com a diferença de que todos os dados cadastrados estarão preenchidos.


Voltando a janela de Configuração Avançada iremos ver que na tabela de
gerenciador, o novo gerenciador aparecerá, este é o gerenciador atual
selecionado (se existir mais de um gerenciador o atual estará realçado em azul).


Agora podemos inserir o cadastro de um Operador.

Lembrando que apenas um Gerenciador pode ser inserido no sistema.

Clique na opção F5 – Novo Cadastro, a partir do momento em que se
existir um gerenciador todo novo cadastro será a inserção de um novo operador.


A tela de entrada de dados é idêntica à do gerenciador.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 30


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


A inserção de dados é idêntica ao gerenciador.

Na opção F6 – Alterar Cadastro, como temos dois cadastros, inicialmente o
sistema perguntará se quer editar o gerenciador, dependendo da resposta irá
editar o gerenciador ou o operador selecionado.


Voltando a janela de Configuração Avançada iremos ver que na tabela de
operador, o novo operador aparecerá, este é o operador atual selecionado (se
existir mais de um operador o atual estará realçado em azul) que estará ligado ao
gerenciador selecionado anteriormente.


Agora podemos inserir um Técnico.

###### **ATENÇÂO: No primeiro cadastro de um Técnico,** **cadastre o administrador da federação. Isto é** **importante pois o administrador tem todos os privilégios de** **cadastro e operação do sistema, após o cadastro de um** **técnico a senha padrão perderá a validade.**


Clique na opção F8 – Novo Usuário.

A janela de cadastro do Técnico irá aparecer.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 31


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Lembre-se o primeiro cadastro deve ser do administrador do sistema.

Todos os campos com identificação Azul são obrigatórios, também é
recomendável carregar a imagem de assinatura do Técnico, arquivo BMP com
tamanho de 182 x 48 Pixel.


Clique em F2 - Gravar para salvar os dados, o software armazenará as
informações e apagará os dados da janela, para, se necessário introduzir mais
Técnicos.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 32


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


ESC - Fechar retorna a tela anterior sem salvar os dados.

Na opção F9 - Editar Técnico, a mesma janela de inserir irá aparecer, com
a diferença de que todos os dados cadastrados estarão preenchidos.


É importante o cadastro de todos os campos e especial atenção ao campo
de Tipo de Acesso, Administrador, Coordenador e Usuário.


Cada um dos acessos têm privilégios de utilização do equipamento.

O sistema deverá possuir pelo menos um administrador cadastrado.

Voltando a janela de Configuração Avançada iremos ver que na tabela de
Técnico, o novo técnico aparecerá, este é o técnico atual selecionado (se existir
mais de um técnico o atual estará realçado em azul).


Com a opção F11- Configuração Geral podemos ter acesso ao menu de
configuração.


Com pelo menos um técnico cadastrado, o usuário já poderá ter acesso ao
Menu de Entrada do software NA9000E do Despoluir.


Na janela de Login temos duas opções, que também estão presentes em
configurações.


        Login Automático: Realiza o Login com o último Login realizado, sem

apresentar esta janela.

        Memorizar Senha: Memoriza os dados do último Login realizado,

sem necessidade de preenchimento.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 33


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


O usuário poderá escolher qualquer uma das opções, no momento
do Login, ou na opção do Menu Configuração Geral.

Nesta janela ao escolher a opção ESC- Fechar, o software é finalizado.

A opção Login, tenta realizar o Login com os dados inseridos.

**3.3. Menu de Entrada:**


A primeira tela do software é o Menu Inicial, onde as funções principais
podem ser selecionadas.


Todas as funções podem ser acessadas pelo menu principal ou pelo
menu superior.


Na barra inferior temos as informações de login, e a identificação do
notebook. A versão atual do SIAD pode ser verificada na barra superior do
software.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 34


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


**3.4. Veículos Cadastrados:**


Nesta opção realizamos podemos realizar o cadastro dos veículos que
serão testados pelo programa SIAD Despoluir.


Podemos cadastrar os veículos antecipadamente, para agilizar o processo
do teste em campo.


Ao Selecionar a opção Veículos Cadastrados ou CTRL+A, o sistema irá
mostrar uma tela com a relação dos veículos cadastrados.


Nesta tela, temos uma lista com todos os veículos cadastrados no sistema.

Temos 3 opções de edição deste cadastro:


**3.4.1. Opção: F2 – Incluir:**


Nesta opção iremos realizar a inclusão dos dados e informações sobre os
veículos de teste.


Ao clicar nesta opção o cadastro do veículo irá tornar-se disponível a tela
de cadastro dos veículos.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 35


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Nesta tela temos 3 opções:

          - **ESC- Fechar** : Volta à tela anterior, sem salvar nenhuma informação.

          - **F2 - Gravar** : Salva os dados cadastrados no formulário.

          - **F7 – Selecionar transportador** : Seleciona um transportador de uma lista
pré-gravada, através desta opção pode-se também se cadastrar um novo
transportados.


          - **F6 – Selecionar Veículos/Limites** : Seleciona um modelo de veículo de
uma lista pré-gravada, através desta opção pode-se também se cadastrar um
novo veículo/limite.


Todos os campos em que a sua denominação está na cor Azul, são
campos obrigatórios para o cadastro, e o cadastro somente será aceito se estes
campos estiverem preenchidos e coerentes.


Alguns campos, como a rotação do veículo, apesar de serem obrigatórios
muitas vezes não estão disponíveis para cadastro, devido a este fato e à
possibilidade, permitida pela instrução normativa do Ibama, de se determinar a
rotação antes da aferição pelo próprio sistema, de que se os dados forem


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 36


#### **_SIAD/NA-9000E_**

**Manual de Instalação**

cadastrados, eles serão utilizados para verificação e aprovação do veículo, caso
não forem cadastrados o sistema automaticamente identifica esta situação e,
durante o teste deste veículo, utiliza o procedimento da Instrução Normativa do
Ibama.


Com a opção F7 – Selecionar Veículos/Limites, o usuário poderá
selecionar um veículo de uma lista pré-definida, onde pode escolher a marca e
modelo de um veículo, por favor leia o item 3.8 deste manual para referência
sobre esta opção.


Com a opção F6 – Selecionar Transportador, o usuário deverá
obrigatoriamente, selecionar um transportador para o veículo. Neste instante ele
poderá efetuar o cadastro de um transportador caso o mesmo não existir.


Após o término do cadastro o técnico deverá obrigatoriamente utilizar a
tecla F2 – Gravar, para salvar os dados.


Os dados cadastrados serão salvos e os dados da tela serão apagados
para um novo cadastro.


Para voltar a tela de seleção selecione ESC – Voltar.

Os veículos cadastrados nesta opção estarão disponíveis para utilização
imediata para realizar testes de emissões, pela opção Novo Teste no menu
principal.


Não há necessidade de se cadastrar antecipadamente os veículos, se um
veículo não se encontra no banco de dados ele será automaticamente cadastrado

ao se iniciar um novo teste.


Esta opção de pré cadastramento dos veículos é apenas para agilizar a
operação em campo dos técnicos.


**3.4.2. Opção: F3 – Alterar:**


Nesta opção o sistema irá abrir a janela de cadastro do veículo com todos
os dados já preenchidos com os valores armazenados, o técnico poderá alterar os
dados e salvar o veículo modificado, como se estivesse inserindo um veículo.


**3.4.3. Opção: F7 – Excluir:**


O técnico poderá excluir o cadastro do veículo selecionado, do banco de
dados.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 37


#### **_SIAD/NA-9000E_**

**Manual de Instalação**

**3.4.4. Opção: F4 – Adicionar Filtro:**


Selecionando no item Campo a ser Filtrado, um dos campos liberados na
caixa de seleção, o técnico poderá digitar ima parte do texto, uma parte ou toda a
placa do veículo, e clicar na opção F4 – Adicionar Filtro.


O sistema irá filtrar todos os dados do campo selecionado que contiverem
o texto do campo Filtro.


**3.4.5. Opção: F5 – Remover Filtro:**


Todos os filtros serão retirados e o sistema irá mostrar todos os veículos

cadastrados.


**3.4.6. Opção: ESC – Voltar:**


Fecha o cadastro de veículos e retorna ao Menu Principal.


**3.5. Transportadores Atendidos:**


Nesta opção iremos cadastrar e visualizar os Transportadores atendidos,
isto é, os proprietários dos veículos que serão aferidos.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 38


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Basicamente o processo de cadastro é similar ao cadastro de veículos com
as mesmas funções, incluindo o filtro para selecionar um conjunto de dados, as
únicas diferenças são os dados cadastrados, e a possibilidade de imprimir a lista
filtrada.


Ao acionar a opção F2- Incluir, uma nova janela com os campos para
cadastro será visualizada.


Dois campos são importantes de serem preenchidos:


        Seleção do tipo de transportador, se é uma empresa ou autônomo.

        Validade do Teste: é o tempo de validade do teste para este

transportador, na opção padrão é o tempo programado em
configuração geral, que por padrão é 180 dias, mas pode ser
alterado pelo técnico, existe outras opções pré definidas na seleção.

Após o preenchimento dos campos o técnico deverá salvar os dados
selecionando a opção F2 – Gravar.


O sistema irá salvar este transportador e estará pronto para incluir mais
transportadores.


Utilize ESC - Fechar para voltar a tela de cadastro.

Na tela de cadastro os transportadores estarão listados pela ordem
alfabética do nome da empresa/autônomo.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 39


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


**3.6. F5 – Relatórios:**


Realiza uma verificação das aferições realizadas podendo inclusive
imprimir novamente uma aferição, ou um relatório das aferições por um conjunto
de filtros.


Temos várias opções de manipulação e visualização das aferições
realizados no banco de dados.

Primeiro é importante descrever o conceito de Arquivados.

Arquivados são os teste que já foram enviados ao sistema despoluir, e que
o usuário não deseja que apareçam na listagem de visualização de relatórios.

Para Arquivar os registros de teste, o técnico deverá selecionar um
conjunto de dados, através do filtro (podendo utilizar toas as opções disponíveis),
e mantendo a opção Arquivados sem seleção deverá utilizar a tecla F7 – Arquivar,
o software irá realizar um filtro nos dados, mostrando apenas os que foram
filtrados e irá solicitar uma confirmação, confirmando todos os registros


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 40


#### **_SIAD/NA-9000E_**

**Manual de Instalação**

selecionados serão marcados como Arquivados e não apareceram mais na lista,
exceto se a opção Arquivados estiver selecionada e for aplicado um filtro.

A opção F5 – Remover o Filtro, remove todos os filtros e mostra o conjunto
inicial de dados, excluindo os arquivados.

Para desarquivar todos os testes ou apenas um conjunto de testes, deixe a
opção Arquivados marcada, aplique um filtro qualquer e clique em F7 – Arquivar,
automaticamente o software entenderá que o técnico deseja desarquivar os testes
e após uma confirmação irá realizar o procedimento.

Para informação do técnico temos dois campos que registram o número de
afeições.


        **Número de registros selecionados:** indica quantos registros estão

selecionados para visualização, ao abrir esta janela indicará
inicialmente quantos registros existem no banco de dados, exceto os
arquivados.

        **Registros Válidos:** é o número de registros que estão dentro das

regras de negócios emitidas pelo Despoluir, para indicar o número
de testes que foram efetivamente realizados e que podem ser
contados como produção pelo operador/gerenciador, é contabilizado
mensamente pelo software.


Na área de Visualização Rápida temos um resumo da informação do
registro de teste, também podemos observar estas informações na lista acionado
a barra de rolagem horizontal.


Para realizar um filtro dos registro, selecione as opções correspondentes e
clique em F4 – Adicionar Filtro, os registros serão filtrados.


A opção F5 – Remover Filtro, volta a lista de registros com todos os
registros não arquivados.


Na opção F8 – Gerar Consolidado, uma lista dos registros filtrados é
impressa, com os dados principais para consolidação.


A opção F10 – Visualizar, nesta opção um relatório do registro selecionado
na lista será mostrado na tela, dando dois cliques no registro selecionado também
executa esta opção.


Utilizando F11 – Imprimir, o registro selecionado na lista será impresso.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 41


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


**3.7. Configuração:**


Nesta opção é aberto um novo menu com as opções de configuração e
ferramentas:


**3.7.1. Configuração Avançada:**


Esta opção permite fazer o cadastro dos gerenciadores, operadores e
técnicos habilitados a utilizar o software e seus respectivos níveis de privilégio.


Esta opção foi descrita na seção 3.2 deste manual, por favor referira-se a
ela para consulta.


**3.7.2. Configuração Geral:**


Em Configuração Geral o técnico possui o acesso à alguns parâmetros e
configurações que facilitam a operação do equipamento.


Alguns dados desta tela são utilizados apenas como referência não sendo
utilizados para configuração, como por exemplo a Conectividade do equipamento.


A conectividade dos equipamentos, informa ao técnico a porta de
comunicação em que o equipamento está conectado, ou foi conectado por último.
Pode ser importante no caso de manutenção do equipamento.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 42


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Os itens de cabeçalho do Relatório estão descontinuados, mas
recomenda-se cadastrá-los para compatibilidade.


São as mesmas informações da tela de login inicial, se o Login automático
estiver selecionado, a tela de Login não aparecerá e o último Login válido se
automaticamente inicializado.


Com a opção Memorizar Senha selecionada, a tela de Login será mostrada
mas os dados de usuário e senha serão automaticamente preenchidos.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 43


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


A validade padrão do relatório de aferição é informada neste campo, deve
ser um valor numérico. Quando selecionada a validade padrão no cadastro do
transportador, o sistema irá utilizar este valor.


Nesta configuração, o técnico pode colocar a altitude padrão para o teste,
lembrando que na tela de início do teste, o técnico poderá modificar este item.


Na Padronização Placa, quando selecionada, uma janela informará ao
técnico quando uma placa digitada não for do padrão AAA9999 (3 letras e 4
números), quando desabilitada esta opção, qualquer indicação será aceita.


Este é o valor da meta de aferições mensais do técnico, deve ser
configurado de acordo com as informações do gerenciador.


Estes campos são utilizados para o técnico indicar dados para os relatórios
impressos e para a tela inicial do software.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 44


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Na área de equipamentos cadastrados, o técnico não tem opção de
cadastrar os equipamentos utilizados, isso é feito automaticamente pelo software
durante a medição, o que o técnico pode realizar ou editar, é o número do
patrimônio do equipamento e, no caso do opacimetro, a data de validade do selo
do Inmetro.


Ele também poderá apagar algum equipamento que não estiver mais sobre
seus cuidados, como no caso de equipamentos reservas.


Lembrar de utilizar a opção F5 – Salvar Equipamento para armazenar as
alterações efetuados nesta opção.


É importante observar que sempre que um equipamento não cadastrado
for utilizado pelo software, ele automaticamente adicionará o equipamento a esta
lista.


Qualquer alteração feita em Configuração Geral deverá ser salva utilizando
a opção F2 – Salvar.


Para voltar a tela anterior utilize ESC – Fechar.

**3.7.3. Realizar backup:**


Esta opção do menu permite que o usuário faça um backup do banco de
dados atual, para segurança dos dados armazenados.


Recomendamos realizar este procedimento semanalmente e armazenar
este arquivo em outro computador ou numa mídia física (como um pendrive).


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 45


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Uma janela para seleção do nome do arquivo e local irá aparecer,
selecione o local do arquivo e clique em Salvar.


**3.7.4. Restaurar backup:**


O programa do SIAD - Despoluir, ao ser acessado pela primeira vez no dia,
criará automaticamente um backup do banco de dados na pasta
C:\NAPRO\NA9000E\BACKUP\TABELAS. Estes arquivos podem ser recuperados
utilizando esta opção.


Também é possível restaurar um backup previamente armazenado com a
opção Realizar Backup.


Ao acionar esta opção uma tela com os arquivos de backup do banco de
dados será visualizado, selecione o arquivo que quer restaurar e clique em
Restaurar o Arquivo Selecionado. Somente poderá ser restaurado um arquivo de
cada vez.


Utilize a opção Restaurar Backup Automático para restaurar o backup
selecionado da lista lateral (seleção em azul).


A opção Restaurar Backup Manual, abrirá uma tela para seleção do arquivo
de backup que se deseja reinstalar.


Voltar menu, retorna ao menu de configuração.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 46


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Em qualquer opção escolhida de restaurar o backup, o software irá
automaticamente fechar as conexões com o banco de dados e restaurar o arquivo
selecionado.


O programa irá perguntar se tem certeza de restaurar este arquivo.


Confirme para restaurar o banco de dados.

Os arquivos de backup automático possuem a seguinte identificação: ano,
mês e dia, no formato aaaammdd.fdb, isto é, o nome do arquivo é formado pelo
ano, mês e dia em que foi gerado.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 47


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


**3.7.5. F4 – Exportar Arquivos:**


Ao executar esta opção o sistema irá inicializar um software de transmissão
de dados.


O técnico deve selecionar a opção de exportação, temos duas opções:


        **Arquivo XML:** Nesta opção o software irá realizar a exportação dos

dados para o sistema Despoluir. O software irá enviar os dados para
um local determinado pelo Programa Despoluir, é necessário o
computador estar conectado à internet.

        **Arquivo CSV:** Nesta opção a exportação será no padrão CSV,

dados separados por ponto e vírgula, passíveis de serem lidos por
gerenciadores de banco de dados ou softwares de planilha, tipo
Excel. Nesta opção o usuário deverá escolher o nome de arquivo e a
pasta onde salvará os dados neste formato.


Os dados podem ser exportados realizando um filtro, de acordo com as
opções apresentadas na tela, por período da aferição ou somente os dados ainda
não exportados, por exemplo.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 48


#### **_SIAD/NA-9000E_**

**Manual de Instalação**

Ao exportar, principalmente pelo arquivo XML, o sistema pode levar um
tempo considerável, que pode variar, dependendo do tamanho dos dados
exportados e da velocidade de conexão com a internet.


**3.7.6. F5 – Importar Arquivos:**


Para poder receber e recuperar os dados cadastrados, pode-se efetuar uma
importação de dados do sistema Despoluir para o computador do técnico.


Será disponibilizado um arquivo em XML para cada solicitante, onde através
da seleção do respectivo arquivo, o sistema irá fazer a importação dos dados para
o computador.


Após o término da importação o sistema volta automaticamente ao menu
anterior.


**3.7.7. Voltar ao Menu:**


Volta ao menu Principal do equipamento.


**3.8. F7 – Limites para Modelos:**


Aqui cadastraremos os limites de opacidade e rotação para os modelos de
veículos.


Para o teste em si não é necessário o cadastro antecipado dos limites, pois
no cadastro do veículo ele pode ser atualizado.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 49


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Esta opção é utilizada para agilizar na determinação dos limites dos
veículos.


Selecionando a montadora, automaticamente todos os veículos
cadastrados, para esta montadora irão ser mostrados na lista lateral.


Pode-se filtrar um determinado veículo, através dos campos do Filtro de
Seleção.


A opção F8 – Limites, permite se verificar os limites do veículo selecionado.

Os itens em Azul deverão ser obrigatória mente cadastrados.

F2 – Gravar é utilizada para atualizar estes valores.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 50


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Pode-se alterar estes limites.

A opção F2 – Inserir Modelo, permite inserir um novo modelo na montadora
selecionada.


O técnico também pode inserir em outra montadora, não necessariamente
na selecionada, com a opção F8 – Limites, é possível inserir os limites deste
veículo.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 51


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Salvando os dados com a opção F2 – Salvar, o modelo estará pronto para
utilização.


Pode-se também alterar um modelo específico, neste caso não é possível
modificar a montadora.


Qualquer modelo de veículo poderá ser apagado do sistema com a opção
F7 – Excluir Modelo.


ESC – Fechar retorna ao menu principal.


**3.9. Logoff :**


No menu suspenso a opção Logoff desconecta o técnico atual e a tela de
Login aparecerá, para um novo usuário.


**3.10. Novo Teste:**


Esta é a opção principal do software SIAD - Despoluir, é nesta opção que
realizamos as operações de medição dos veículos e coletamos os resultados
para posterior envio ao sistema Despoluir.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 52


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Ao entrar na opção Novo Teste, aparecerá a janela de cadastro do veículo
para teste.


Todos os campos em Azul são obrigatórios.

Ao digitar a placa do veículo, se o mesmo já estiver cadastrado no banco
de dados, automaticamente todos os dados de cadastro serão preenchidos.
Exceto os dados pertinentes a este teste, como por exemplo, consumo,
hodômetro, temperatura do motor, etc.


Alguns dados como Estado Aferição, Cidade Aferição são obrigatórios e
devem ser preenchidos. Outros dados não obrigatórios devem ser sempre
preenchidos para melhorar as informações das aferições.


É importante verificar a seleção de altitude, se está correta, pois influencia
no valor limite de opacidade.


No caso em que o veículo não está cadastrado no banco de dados, o
técnico não necessita entrar na opção de cadastro do veículo, ele pode realizar o
cadastro nesta tela da mesma maneira que é executado na opção Veículos
Cadastrados.


O técnico deverá cadastrar os dados do veículo, e ao iniciar o teste na
opção F12 – Iniciar Teste, o sistema automaticamente irá adicionar este veículo
ao banco de dados.


Se por acaso o técnico verificar que algum dos dados cadastrados não
estiver correto, ele poderá realizar a alteração, que o sistema irá
automaticamente corrigir no banco de dados.


Ao digitar uma placa, além de verificar o cadastro, o sistema mostrará na
tela a quantidade de aferições deste veículo no mês vigente.


Qualquer observação pertinente ao teste poderá ser digitada no campo
observação.


Como exemplo vemos uma tela preenchida abaixo:


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 53


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Com a tecla F5 – Apagar Dados podemos apagar todos os dados da tela e
escolher um outro veículo.


Sempre lembrando que após digitar a placa do veículo, se esta placa não
estiver cadastrada no banco de dados todos os dados preenchidos serão
apagados, devido ao sistema entender que o usuário deseja inserir um novo
veículo.


Se todos os dados estiverem preenchidos corretamente, primeiro
deveremos nos certificar que todos os equipamentos estão ligados e
alimentados, exceto a sonda de captação de gases, que não deve estar inserida
no veículo.


O medidor de RPM MGT-300 deve estar ligado e conectado ao veículo,
verifique o manual do MGT-300 para maiores informações.


Iniciamos o teste com a opção F12 – Iniciar Teste.

A primeira atividade do software SIAD, é acionar o software de captura de
fotos do CNT, o sistema fica aguardando a finalização da captura de fotos.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 54


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


O software de captura de fotos irá iniciar automaticamente.


Selecione a câmera que deseja utilizar, posicione na frente do veículo e
clique no botão Fotografar (fast).


Posicione na diagonal do veículo e clique novamente no botão.

Posicione na traseira do veículo e clique no botão.

Para tirar novas fotos selecione Limpar, para Finalizar clique em Finalizar.

Automaticamente o SIAD saberá quais e quantas fotos foram adquiridas
do veículo e continuará a operação.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 55


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


O software é verificar se o opacímetro está conectado.


Neste instante o software irá verificar em todas as portas seriais
disponíveis no computador a presença do opacimetro, ao iniciar a comunicação
com o opacimetro, o software irá verificar se o mesmo já está cadastrado no
sistema.


Caso for a primeira utilização ou houver ocorrido a troca do opacimetro, o
software irá solicitar ao técnico que seja introduzido o número do patrimônio e a
data de validade do selo do Inmetro.


Por padrão a data de validade da verificação do Inmetro será de 365 dias
após a data do cadastro, o técnico deverá se certificar e consultar a data correta,
esta data pode ser alterado em Configuração Geral.


Lembrando que estes dados são armazenados no banco de dados de
teste, por este motivo a importância do número do patrimônio e da data de
verificação do Inmetro.


Após o cadastro ou caso o opacimetro já estiver cadastrado, o software irá
inicializar o processo de medição conforme a Instrução Normativa do Ibama.


Inicialmente deverá ser realizada uma pré-inspeção visual no veículo.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 56


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Deve-se verificar os itens conforme a Instrução normativa.

Por padrão todas as opções se iniciam na condição de ativas com a letra
“S” no campo de estado.

Para o técnico desmarcar a opção deverá digitar a letra “N” ou através da
tecla de espaço.

A tecla de espaço altera a condição do item de verificação da condição “S”
para “N” ou vice-versa, e automaticamente vai para o outro campo.

Para reprovar algum item utilize a tecla “TAB” do teclado para pular o item
reprovado.

Caso algum item da Pré-Inspeção Visual esteja reprovado. O veículo é
considerado rejeitado e o teste é encerrado.

O botão “ESC - Cancelar” cancela o teste e volta na tela de entrada de

dados.

Caso o teste for cancelado o técnico deverá registrar o motivo do
cancelamento.

O botão “F9 - Continuar” confirma os dados da tela, pode ser utilizada a
tecla Return do teclado.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 57


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Após a Pré-Inspeção Visual é realizada a inspeção visual do equipamento.


A inspeção visual é similar à pré-inspeção visual, a única diferença é
que se o veículo possuir algum item de reprovação, ele é reprovado, mas o teste
contínua.

Ao clicar no botão “F9 - Confirmar”, ou utilizar a tecla Return do teclado,
caso algum item esteja reprovado o sistema informará ao técnico a reprovação e
continuará o processo, caso contrário, ele não informará o erro e se dirigirá direto
para a tela de determinação do RPM.

Inicialmente o sistema apresentará a mensagem:

###### **_AGUARDE PROCURANDO MEDIDOR DE RPM_**


Após localizar o medidor de RPM (lembrando que o medidor deve estar
ligado e medindo para o correto funcionamento), se o cadastro do medidor de
RPM não contiver o número do patrimônio o software irá solicitar a que o técnico o
preencha.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 58


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Com o motor ligado o equipamento irá realizar a medição da rotação do
veículo.


O equipamento solicita ao técnico para manter o motor na marcha lenta e
inicia a medição de rotação, caso o valor esteja estabilizado o técnico deverá
clicar no botão “F4 - Confirmar Valor” para confirmar o valor de marcha lenta.


O valor de marcha lenta é registrado e o sistema solicita ao operador que
acelere o veículo lentamente até a rotação de corte.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 59


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


O sistema irá medir a maior rotação alcançada e considerá-la como a
rotação de corte. O técnico deve clicar no botão “F4 - Confirmar Valor”, para
confirmar o valor da rotação de corte.


O sistema fica esperando a confirmação dos valores através do botão “F9 Confirmar”.


Ao confirmar os valores o sistema irá verificar se no cadastro do veículo
foram inseridos os limites de rotação.


Caso os limites existam o sistema irá adicionar ao limites o valor
recomendado pela resolução do Conama e comparar com os valores
determinados na medição do RPM, caso estes valores difiram dos limites o
sistema irá rejeitar ou reprovar o veículo.


Caso os limites não foram informados no cadastro do veículo o sistema irá
considerar o valores medidos como referência, conforme a resolução do Conama.


Se o técnico perceber alguma anormalidade no motor ou na aceleração do
veículo, deve parar imediatamente e acionar o botão F10 - Rejeitar Veículo, para
terminar o teste. O veículo neste caso será rejeitado e o teste será finalizado.


Realizada a determinação da rotação do veículo, o sistema irá executar a
medição dos valores de opacidade.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 60


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


O programa realizará uma checagem se o módulo de opacidade está
pronto para operar. Caso necessite de aquecimento a seguinte mensagem
aparecerá.

###### **_AGUARDE EQUIPAMENTO EM AQUECIMENTO_**


O equipamento estará entrando em regime de operação, isto sempre
acontece após o equipamento ser ligado, ou nos casos em que ele ficou mais
de 10 minutos sem operação.

###### **_AGUARDE CALIBRANDO O EQUIPAMENTO_**


Após o tempo de aquecimento o equipamento será calibrado
internamente para compensar qualquer interferência.

###### **_Insira a Sonda no Escapamento e pressione_** **_F9 - Continuar_**


O equipamento estará pronto para operação. Coloque a sonda de
captação de gases no escapamento do veículo a ser medido e verifique se o
veículo já está em condições normais de operação.


Aperte RETURN ou clique em F9 - Continuar, para realizar o teste.

O SIAD inicialmente solicita para manter o veículo em marcha-lenta
para verificar os valores iniciais do equipamento e da opacidade.

###### **_AGUARDE EM MARCHA LENTA_**


Ao iniciar o teste o SIAD solicitará para acelerar o veículo até a rotação
de corte.


Sempre que solicitado durante a aferição de opacidade a aceleração
até a rotação de corte, o técnico deverá acelerar o veículo de forma e
constante em até um segundo, sem golpe no acelerador do veículo, até atingir
o final do seu curso.


Siga as instruções na tela.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 61


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Mantenha na posição final do curso até o equipamento solicitar a
desaceleração.


O software solicitará até um máximo de 10 medições. A primeira
medição é eliminada, as 3 medições consecutivas seguintes serão verificadas
se a diferença entre elas for menor ou igual a 0,50, neste caso uma média
pode ser calculada e o veículo aprovado ou reprovado de acordo com o limite
de opacidade.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 62


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Caso as 3 primeiras medições não estejam dentro da tolerância de
0,50, outras medições serão realizadas considerando os 3 últimos resultados
até a 10ª medição, se mesmo na última medição não for possível realizar uma
média o veículo é reprovado.


Durante a realização do teste, caso ocorra alguma anormalidade durante
as acelerações no motor ou no veículo o técnico deverá utilizar o botão
“REJEITAR VEÍCULO” para finalizar o teste e rejeitar o veículo.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 63


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


Ao final da medição o operador poderá imprimir o resultado da medição.


Ou se preferir apenas Confirmar a medição para voltar à entrada de dados
para uma nova medição.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 64


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


**3.11. Demonstração:**


A opção Demonstração, é utilizada para realizar uma demonstração do
procedimento de teste, para o técnico poder mostrar como é realizada a aferição.


Nesta opção não é necessário nenhum equipamento de medição
conectado, e os resultados não são armazenados.


A tela de cadastro já entra preenchida com dados de um veículo fictício,
mas o técnico tem a opção de digitar qualquer veículo cadastrado no banco de
dados.


Todos o procedimento é igual a um teste oficial, apenas os valores de rpm
e opacidade podem ser alterados.


Na tela de verificação da rotação de corte e marcha lenta, duas setas
apareceram ao lado da medição de RPM para o técnico pode alterar a rotação.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 65


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


O técnico deverá acertar a rotação de acordo com sua necessidade e
confirmar os valores.


Após a verificação da rotação o software entrará automaticamente na
medição de opacidade, e irá realizar as acelerações de maneira automática.


O técnico deverá apenas modificar o valor de opacidade com as setas da
medição de opacidade.


O software irá verificar os valores de opacidade de acordo com a norma e
mostrar o resultado do teste do veículo.


Se necessário o teste pode ser impresso como exemplo para o
interessado.


**3.12. Sair:**


Opção do menu suspenso, sai do software e volta ao sistema
operacional.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 66


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


_**4.**_ **Manutenção:**

O equipamento não possui manutenção preventiva especial, mas
alguns cuidados devem ser tomados na utilização do equipamento.


 **Limpeza:** Mantenha o equipamento sempre limpo. Semanalmente realize

uma limpeza nas lentes de medição.
Com um pano macio e limpo (de preferência algodão) passe pela parte
interna das saídas de fumaça do módulo de medição, limpando as lentes
e o espelho que existem. Cuidado para não riscar nenhuma destas peças
(uma limpeza mais profunda só deve ser realizada pela assistência
técnica).
 **Cabos e Acessórios:** Os cabos não devem ser torcidos dobrados ou

tracionados, isto diminue a vida útil deles, além de acarretar quebras ou
mau-contato.
 **Códigos de Erro:** Alguns códigos de erro podem ocorrer em funções de

características dinâmicas da medição e dos acessórios utilizados. Sempre
que ocorrer códigos de erro ou mau-funcionamento. Desligue o módulo de
medição da alimentação e saia do programa de gerenciamento. Realize
uma limpeza nas lentes de medição. Aguarde alguns instantes e religue
novamente. Se o código de erro persistir entre em contato com a
assistência técnica.


**Manutenção específica para o banco de opacidade NA9000P:**

**1 – Diária:**
Limpeza do equipamento e cabos de comunicação e alimentação.
Verificação das condições gerais dos cabos e equipamento. Identificação de
fissuras ou rachaduras nos cabos e conectores. Limpeza dos protetores óticos
com um pincel limpo e seco e posteriormente com um pano limpo e seco.


**2 – Semanal:**
Limpeza Geral do equipamento e verificação diária. Realização de backup dos
dados armazenados. Verificação da sonda de coleta de gases e sua
respectiva mangueira, quanto a rachaduras ou fissuras.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 67


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


**3 – Mensal:**
Limpeza completa do equipamento. Limpeza da câmera de medição com
aplicação de jato de ar comprimido pelo tubo de entrada, para eliminar
resíduos de particulado. Realização da limpeza das lentes conforme
verificação diária.


_**5.**_ **Especificações:**

###### **OPACÍMETRO NA9000P:**


 **Tensão de Alimentação:** 11 a 28Vdc
85 à 265 Vac (opcional)
 **Potência Máxima:** 60W
 **Fusível de Proteção:** 3,5 A.
 **Tamanho da sonda de captação de gases:** 1,2 metros
 **Temperatura de funcionamento:** 2 ~ 50ºC
 **Dimensões:** aprox. 330x310x190 mm
 **Peso:** ~ 6 kg
 **Percurso Ótico equivalente:** 430mm
 **Tempo de Aquecimento** < 10 minutos
 **Faixa de Medição** 0 – 99,9% / 0 – 9,99m [-1]
 **Resolução** 0,1% / 0,01m [-1]


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 68


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


_**6.**_ **Garantia:**

**1)** Este produto é garantido pela Napro Eletrônica Industrial, por um período de 12

meses. O período de garantia é contado a partir da Data de Emissão da Nota
Fiscal original de venda. É obrigatória a apresentação do Certificado e da Nota
Fiscal. A garantia é realizada apenas em balcão, isto é, nas dependências da
fábrica.

**2)** Para o **PROJETO DESPOLUIR**, o produto é garantido por um período de 36

meses com verificação periódica do INMETRO. Durante os 36 meses de garantia,
no período de verificação do INMETRO ou durante o conserto de algum
equipamento, deverá ser garantido o empréstimo de um equipamento reserva
similar. As despesas com transporte do equipamento reserva dentro da garantia
não será de responsabilidade do cliente.

**3)** Para componentes de informática sujeitos ao desgaste pelo uso, tem-se o prazo

de garantia abaixo:

  Unidades de Disco Flexível (180 dias)

  Unidades de Disco Rígido (180 dias)

  Fonte de Alimentação (180 dias)

**4)** Os analisadores que utilizarem sensores químicos têm prazo de garantia

conforme indicado abaixo:

  - Sensor de Nox ( 180 dias)

  - Sensor de O2 ( 270 dias)


**5)** Entende-se como garantia do equipamento, a substituição ou reparo de qualquer

componente gratuitamente, desde que o defeito seja de fabricação.

**6)** Somente os técnicos da Napro Eletrônica Industrial Ltda ou por ela credenciados,

poderão executar os serviços de manutenção. Não é de responsabilidade da
Napro Eletrônica Industrial Ltda, custos e/ou danos causados na manutenção
efetuada por terceiros. A intervenção de pessoas não autorizadas, bem como a
violação de lacres, ou etiquetas implica na “ _Perda de Garantia_ ”. A Napro
Eletrônica Industrial Ltda se reserva o direito de tomar as providências cabíveis
para assegurar que pessoas não autorizadas executem serviços de manutenção
em seus equipamentos.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 69


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


**7)** A Garantia não cobre danos causados por:


  Instalação indevida inclusive em voltagem imprópria.

  Descarga elétrica.

  Acidentes por causas naturais (incêndios, enchentes, etc.)

  Má manipulação ou danos ocasionados por violência.

  Manutenção inadequada efetuada pelo Cliente.

  Danos decorrentes de transporte ou embalagem inadequadas, utilizados pelo

Cliente durante o período de Garantia.

  Desgaste natural por uso contínuo do produto.

  Operação fora das especificações ambientais e técnicas para o produto.

**8)** Também não estão previstas nos serviços em Garantia, as correções de mau

funcionamento causado por VÍRUS; Instalação de programas incompatíveis;
Deleção indevida de arquivos; Alteração de parâmetros de configuração; e/ou
outros danos possíveis causados na operação. Não fazem parte da garantia os
serviços de instalação de software, aplicativos e/ou periféricos fornecidos ou não
pela Napro Eletrônica Industrial Ltda. Nestes casos a Napro se reserva o direito
de Cobrança de horas técnicas despendidas conforme valores vigentes na época.


**9)** Não fazem parte da garantia materiais de consumo normal e desgaste, tais como:

filtros, fitas e papéis de impressora, mangueiras, reparos de bomba, gases, etc., e
também componentes ou acessórios de manipulação constantes, tais como:


  Sondas de captação de gases

  Sonda de temperatura

 - Sensores de RPM

  Conectores, cabos e outros que estão sujeitos aos mesmos esforços de

manipulação.


**10)** As despesas com transporte e embalagem não estão cobertos pela Garantia.
Não é de responsabilidade da Napro Eletrônica Industrial Ltda, dano de qualquer
natureza ocorrido durante o transporte seja por negligência ou embalagem
indevida.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 70


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


**8** **- ANEXO 1: Impressão no Formato PDF.**


Para realizar a impressão do relatório em formato PDF, é necessário
selecionar a impressora específica para esta função, a impressora foi instalada com
o software. No caso selecione a impressora PDFCreator, no gerenciador de
impressão ou na seleção de impressoras na visualização do relatório.


O relatório do teste é gravado no seguinte formato:

(PLACA) (DATA) (HORA).PDF

XXXXXXX DD_MM_AA HH_MM_SS.PDF

Sabemos a placa do veículo data e hora em que o teste foi realizado. Isto
permite identificar facilmente o teste gravado.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 71


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


**9** **- ANEXO 2: CÓDIGOS DE ERRO**


Abaixo uma relação, dos códigos de erros emitidos pelo programa:


    - **ERRO ABRINDO PORTA SERIAL COMX:**

`o` A porta serial X do computador já está aberta.


    **ERRO DE COMUNICAÇÃO CÓDIGO XXX:**

`o` O código indicado como XXX identifica a posição do programa onde ocorreu o

erro, esta identificação auxilia a manutenção nos defeitos que podem ocorrer,
devem ser anotados e comunicados à assistência da Napro.
`o` Verificar se o adaptador USB está devidamente encaixado na porta USB do

computador. Espere o programa entrar no Menu Principal ou entrada de
dados, retire e depois de 10 segundos coloque novamente o conversor
USB/Serial na porta USB.
`o` Reinicialize o computador.
`o` Verifique se o módulo de medição está conectado ao cabo de comunicação.
`o` Verifique se o módulo de medição está alimentado.
`o` Verifique se o cabo de comunicação está devidamente encaixado no

equipamento e no computador ou conversor USB/Serial.
`o` Verifique os terminais dos conectores do cabo de comunicação, conversor

USB/Serial e conectores do módulo de medição.
`o` Se nenhuma das opções anteriores surtir efeito, entre em contato com a

Napro.


    - **ERRO NO AJUSTE DE ZERO. CÓDIGO 007.FALHA 0xXXXX:**

`o` Esse erro ocorre durante a realização do zero, as lentes do equipamento estão

sujam e é necessário limpeza. A indicação de falha é relacionada ao tipo de
erro do zero.
`o` Utilizando o “cotonete” fornecido, embebido em álcool ou em último caso

umedecido com água, limpe as lentes do equipamento através das aberturas
inferiores do módulo de medição.
`o` Na persistência do erro entre em contato com a Napro.

    - **ERRO COMUNICAÇÂO: Código: 012** :

`o` O equipamento ao ser iniciado um teste verifica se o módulo de medição está

conectado ao computador. Caso ele não encontre o módulo de medição, o
programa realiza uma varredura em todas as portas serias do computador. E
caso não encontre o módulo de medição, indica este erro.
`o` Realize todas as verificações como se fosse um erro de comunicação.

    - **ERRO VERSÃO MÓDULO. CÓDIGO: 013:**

`o` A versão do módulo de medição não é condizente. Entre em contato com a

Napro.

   **ERRO TEMPERATURA CÂMARA. Código: 101 ou 102:**

`o` Erro no sistema de aquecimento da câmera de medição desligue e ligue

novamente o equipamento se o erro persistir entre em contato com a Napro.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 72


#### **_SIAD/NA-9000E_**

**Manual de Instalação**


**ERRO NO SINAL DO EMISSOR. Código: 103:**

`o` Limpe os protetores óticos como demonstrado no item Manutenção

Preventiva.
`o` Desligue e ligue o equipamento.
`o` Na persistência do erro entre em contato com a Napro.


**LENTES SUJAS. Código: 104:**

`o` Limpe os protetores óticos como demonstrado no item Manutenção

Preventiva.
`o` Desligue e ligue o equipamento.
`o` Na persistência do erro entre em contato com a Napro.

**TENSÂO DE ALIMENTAÇÂO FORA DA FAIXA: 105:**

`o` Tensão de Alimentação está fora da faixa operacional do equipamento.
`o` Verifique a tensão de alimentação.
`o` Na persistência do erro entre em contato com a Napro.
`o` Verifique se equipamento não está ligado numa bateria de 24Volts.


NAPRO ELETRÔNICA INDUSTRIAL LTDA. 73


