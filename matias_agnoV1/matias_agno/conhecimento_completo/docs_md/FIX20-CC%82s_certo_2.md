# FIX20-CC%82s_certo_2

# **INSTRUÇÕES** **DE OPERAÇÃO**

### **Índice**

Precauções de segurança ...................... 2


Informações de Manutenção do Veículo . 3


Inspeção visual ......................................  3


Especificações elétricas ....................... 34


Garantia................................................ 104


**1. Funções básicas do multímetro**


Funções e Definições de Exibição........... 4


Definir o alcance....................................... 6


Substituição de Bateria e Fusível ........... 7


Medição de Tensão CC........................... 8


Medição da Tensão CA .......................... 8


Medição de Resistência ......................... 9


Medição da Corrente CC ....................... 9


Teste de Continuidade ........................... 10


Teste de Diodos ..................................... 11


Medição de RPM do Motor .................... 11


Medição de Dwell .................................. 12


**2. Teste Automotivo**


Teste Geral ............................................ 13


  - Teste de Fusíveis................................. 13


  - Teste de Interruptores ........................ 13


 - Teste de solenoides e Relés .............. 14


 - Iniciando / Teste do Sistema de


Carregamento ....................................... 15


 - Teste Sem Carga da Bateria ............... 15


 - Corrente da Bateria com Motor Desligado....15




- Tensão de Partida / Teste de Carga da Bateria .16


- Quedas de Tensão .......................................... 17


Teste de Tensão do Sistema de Carregamento . 18


Teste do Sistema de Ignição ............................ 19


- Teste de Bobina de Ignição ............................ 19


- Fios do Sistema de Ignição .......................... 21


- Sensores de Efeito Hall / Interruptores ......... 22


- Bobinas Magnéticas de Recolhimento ........ 23


- Sensores de Relutância ................................. 23


Ação de Troca da Bobina de ignição .............. 24


Teste do Sistema de Combustível ................... 25


Testando o Solenoide de Controle de Mistura


GM C-3 .............................................................. 25


Medição da Resistência do Injetor de


Combustível ....................................................... 26


Teste de Sensores do Motor ............................ 27


- Sensores do tipo oxigênio (O) ........................27


Sensores de Tipo de Temperatura .................. 29


Sensores de Tipo de Posição - Posição da


Válvula do Acelerador e do EGR, Fluxo de


Ar da Aleta .......................................................... 30


Sensores de Pressão Absoluta do Coletor


(MAP) e Pressão Barométrica (BARO). 31


Sensores de Fluxo de Ar de Massa (MAF) ... 32



**1**


**Orientações de Segurança**
Para evitar acidentes que possam resultar em lesões graves e/ou
danos ao seu veículo ou equipamento de teste, siga cuidadosamente
as regras de segurança e procedimentos de teste


- Use sempre proteção aprovada para os olhos.

- Sempre opere o veículo em uma área bem ventilada. Não inale os gases de
escape - eles são muito venenosos!

- Sempre mantenha a si mesmo, ferramentas e equipamentos de teste longe de
todas as partes móveis ou quentes do motor.

- Certifique-se sempre de que o veículo esteja em “park” (estacionado)
(transmissão automática) ou neutro (transmissão manual) e que o freio de mão
esteja firmemente ajustado. Bloqueie as rodas motrizes.

- Nunca coloque ferramentas na bateria do veículo. Você pode encurtar os
terminais, causando danos a si mesmo, às ferramentas ou à bateria.

- Nunca fume ou tenha chamas abertas perto do veículo. Os vapores da gasolina
e da bateria são altamente inflamáveis e explosivos.

- Nunca deixe o veículo sem supervisão durante os testes.

- Mantenha sempre um extintor de incêndio adequado para incêndios por gasolina
/ eletricidade / químicos.

- Sempre tenha muito cuidado ao trabalhar ao redor da bobina de ignição, da
tampa do distribuidor, dos cabos de ignição e das velas de ignição. Esses
componentes contêm alta tensão quando o mecanismo está em funcionamento.

- Sempre desligue a chave de ignição ao conectar ou desconectar componentes
elétricos, a menos que seja instruído de outra forma.

- Siga sempre os avisos, precauções e procedimentos de manutenção do
fabricante do veículo.

- Conformidades de Segurança: UL 61010-1 e CAN / CSA-C22.2 No. 61010-1:
CAT 1 1000V, CAT II 600V, grau de poluição 2.

- A sonda de teste e o chip satisfazem a categoria de medição mais rigorosa do
que o medidor.


**PRECAUÇÃO:**


Alguns veículos estão equipados com airbags de segurança. Você deve seguir as
precauções do manual de serviço do veículo ao trabalhar em torno dos componentes
do airbag ou da fiação. Se os cuidados não forem seguidos, o airbag pode abrir
inesperadamente, resultando em ferimentos pessoais. Observe que o airbag ainda
pode abrir alguns minutos depois que a chave de ignição estiver desligada (ou mesmo
se a bateria do veículo estiver desconectada) por causa de um módulo especial de
reserva de energia.


Todas as informações, ilustrações e especificações contidas neste manual são
baseadas nas últimas informações disponíveis de fontes da indústria no momento da
publicação. Nenhuma garantia (expressa ou implícita) pode ser feita por sua exatidão
ou integridade, nem qualquer responsabilidade assumida pela Bosch ou por qualquer
pessoa relacionada a ela por perdas ou danos sofridos através da confiança em
qualquer informação contida neste manual ou uso incorreto do produto em anexo.
A Bosch reserva-se o direito de efetuar alterações a qualquer momento neste manual
ou produto acompanhante sem obrigação de notificar qualquer pessoa ou organização
de tais alterações.


**2**


**Manual de Manutenção do Veículo - Fontes para**
**Informações de Manutenção**


A seguir, uma lista de fontes para obter informações de serviço do veículo para seu
veículo específico.

- Entre em contato com o Departamento de Peças de Concessionária
Automotiva local.

- Entre em contato com as lojas locais de autopeças de varejo para obter
informações sobre serviços de veículos de reposição.

- Entre em contato com sua biblioteca local. As bibliotecas geralmente permitem
que você faça o check-out dos manuais de serviços automotivos.


**Faça uma inspeção visual completa**


Faça uma inspeção minuciosa completa e “prática” antes de iniciar qualquer
procedimento de diagnóstico! Você pode encontrar a causa de muitos problemas
apenas olhando, economizando muito tempo.




- O veículo foi reparado
recentemente? Às vezes, as
coisas são reconectadas no lugar
errado ou não são conectadas a

nada.

- Não vá pelo caminho mais fácil.
Inspecione as mangueiras e a
fiação que podem ser difíceis de
ver devido à localização.

- Inspecione o filtro de ar e o duto
quanto a defeitos.

- Verifique os sensores e atuadores
quanto a danos.

- Inspecione os cabos de ignição

para:


– Terminais danificados.


– Plugues de vela de ignição
rachados ou partidos


– Divisões, cortes ou quebras dos
fios de ignição e o isolamento.

- Inspecione todas as mangueiras
de vácuo para:


– Corrigir o roteamento. Consulte
o manual de serviço do veículo ou
o adesivo VECI (Vehicle Emission
Control Information) localizado no
compartimento do motor.



– Pressões e torções.


– Divisões, cortes ou quebras.

- Inspecione a fiação para:


– Contato com bordas afiadas.


– Contato com superfícies
quentes, como coletores de

escape.


– Isolamento pressionado,
queimado ou desgastado.


– Roteamento e conexões

adequados.

- Verifique os conectores elétricos

para:


– Corrosão nos pinos.


– Pinos dobrados ou danificados.


– Contatos não encaixados
corretamente no alojamento.


– Encaixe ruim do fio nos

terminais.



**3**


## **Seção 1. Funções Básicas do** **Multímetro**

Multímetros digitais ou DMMs possuem muitos recursos e funções especiais. Esta
seção define esses recursos e funções e explica como usá-los para fazer várias
medições.


**4**


**Funções e Definições de**
**Exibição**


**1. INTERRUPTOR GIRATÓRIO**

O interruptor é girado para selecionar
uma função.


**2. VOLTS CC**

Esta função é usada para medir
Tensões CC (Corrente Contínua) na
faixa de 0 a 1000V.


**3. OHMS**

Esta função é usada para medir a
resistência de um componente em um
circuito elétrico na faixa de 0,1 a 20M.
(é o símbolo elétrico para Ohms)


**4. VERIFICAÇÃO DE DIODO / TESTES**
**DE CONTINUIDADE**

Esta função é usada para verificar se
um diodo é bom ou ruim. Também é

usada para


verificações rápidas de continuidade de
fios e terminais. Um tom audível soará

se um fio e um terminal estiverem bons.


**5. ESPERA**

Pressione o botão ESPERA para reter
os dados no visor. No modo de espera,
o anunciador "H" é exibido.


**6 CONECTORES DE TESTE - PRETO**


O conector de teste
é sempre inserido no
conector COM.


**VERMELHO** O conector

de teste vermelho é

inserido no conector
correspondente à
configuração da chave
rotativa do multímetro.


**Sempre conecte os CONECTORES DE**
**TESTE ao multímetro antes de conectá-**

**los ao circuito em teste !!**


**7. VOLTS CA**

Esta função é usada para medir
Tensões CA na faixa de 0 a 750V.



**8. AMPS CC**

Esta função é usada para medir
Amperes CC (corrente contínua) na
faixa de 0 a 10A.


**9. DWELL**

Esta função é usada para medir
DWELL em sistemas de ignição de
distribuidores e solenoides.


**10. TACH**

Esta função é usada para medir a
velocidade do motor (RPM).


**11. ON/OFF**

Pressione para ligar. Pressione
novamente para desligar a energia.


**12. EXIBIÇÃO**

Usado para exibir todas as medições e
informações do multímetro.


**Bateria fraca** - Se este símbolo aparecer
no canto inferior esquerdo do visor,

substitua a bateria

interna de 9V.
(Consulte Substituição
de Fusíveis e Baterias
na página 7.)


**Indicação acima da**
**escala**


              - Se “1” ou “-1”

aparecer


no lado esquerdo do
visor, o multímetro está
configurado para um
intervalo que é muito
pequeno para a medição atual. Aumente o
alcance até que isto desapareça. Se não
desaparecer depois de todos os intervalos
de uma função específica terem sido
tentados, o valor a ser medido é muito
grande para o multímetro medir. (Consulte
Definir o Alcance na página 6.)


**Ajuste Zero**
O multímetro irá automaticamente zerar
as funções Volts, Amps e RPM.


**Sensor Automático de Polaridade**


O visor do multímetro mostrará um
sinal de menos (-) nas funções de Volts
CC e Corrente CC quando a conexão
do conector de teste estiver invertida.



**5**


**Definir o alcance**


Duas das perguntas mais comuns
sobre multímetros digitais são: **O que o**
**Alcance significa? e Como eu sei a**
**qual Alcance o multímetro deve ser**
**configurado?**


**O que significa Alcance?**


Alcance refere-se ao maior valor que
o multímetro pode medir com a chave
rotativa nessa posição. Se o multímetro
estiver configurado para a faixa de 20V
CC, a tensão mais alta que o multímetro
poderá medir será de 20V nessa faixa.


EXEMPLO: Medição da Tensão da
Bateria do Veículo (veja a Fig. 1)


Suponhamos que o multímetro esteja
conectado à bateria e definido para o
intervalo de 20V.


O mostrador indica 12,56. Isso significa
que há 12,56 V nos terminais da bateria.



Agora, suponha que configuramos o
multímetro para o intervalo de 2V. (Veja
Fig. 2)


O visor do multímetro mostra agora um
"1" e nada mais. Isso significa que o
multímetro está acima da escala ou, em
outras palavras, que o valor que está
sendo medido é maior que o alcance
atual. O alcance deve ser aumentado
até que um valor seja exibido no visor.
Se você estiver na faixa mais alta e o
multímetro ainda estiver mostrando que
está se excedendo, então o valor que
está sendo medido é muito grande para
o multímetro medir.


**Como eu sei a qual Alcance o**
**multímetro deve ser definido?**


O multímetro deve ser ajustado na faixa
mais baixa possível sem sair da escala.


EXEMPLO: Medindo uma resistência

desconhecida


Suponhamos que o multímetro esteja
conectado a um sensor de refrigeração
do motor com resistência desconhecida.
(Veja Fig. 3)


Comece configurando o multímetro
para o maior intervalo de OHM. O visor
indica 0,0 ou um curto-circuito.
Esse sensor não pode ser curto, portanto
reduza a configuração do intervalo até
obter um valor de resistência.
Na faixa de 200K, o multímetro mediu
um valor de 4,0. Isso significa que há
4K de resistência nos terminais do
sensor de líquido de resfriamento do
motor. (Veja Fig. 4)



**6**


Se mudarmos

o multímetro
para a faixa
de 20K (Veja a
Fig. 5), o visor
mostrará um

valor de 3,87K.
O valor real da

resistência é

de 3,87K e não
4K, medido na
faixa dos 200K.

Isto é muito

importante

porque se as
especificações
do fabricante

disserem que o
sensor deve ler
3,8-3,9K a 70°F (21°C), então na faixa de
200K o sensor estaria com defeito, mas na
faixa de 20K testaria bem.


Agora defina
o multímetro

para o
intervalo de
2K. (Veja
a Fig. 6) O
visor indicará
uma condição
acima da

escala, porque
3,87K é maior
que 2K.
Este exemplo
mostra que,
ao diminuir o
alcance, você

aumenta a
precisão da sua medição. Quando você
altera o intervalo, altera a localização
do ponto decimal.



Isso altera a precisão da medição,
aumentando ou diminuindo o número
de dígitos após o ponto decimal.


**Substituição de Bateria e**
**Fusível**


Importante: Uma bateria de 9 volts deve
ser instalada antes de usar o multímetro
digital. (veja o procedimento abaixo
para instalação)


**Substituição da Bateria**


**1.** **Desligue o multímetro.**


**2.** **Remova os terminais de teste do**
**multímetro.**


**3.** **Remova o parafuso da tampa da**
**bateria.**


**4.** **Remova a tampa da bateria.**


**5.** **Instale uma nova bateria de 9**
**volts.**


**6.** **Monte novamente o multímetro.**


**Substituição de fusível**


**1.** **Desligue o multímetro.**


**2.** **Remova os terminais de teste do**
**multímetro.**


**3.** **Remova o estojo de borracha.**


**4.** **Remova o parafuso da tampa da**
**bateria, a tampa da bateria e a**
**bateria.**


**5.** **Remova os parafusos da parte**
**traseira do multímetro.**


**6.** **Remova a tampa traseira.**


**7.** **Remova o fusível.**


**8.** **Substitua o fusível pelo mesmo**
**tamanho e tipo da instalação**
**original.**


Fusível 1: Fusível de 500mA, 250V
de cerâmica do tipo rápido Ø5 x
20mm.
Fusível 2: 10A, 250V, tipo rápido,
fusível de cerâmica, Ø6.35 x
31.8mm.


**9.** **Monte novamente o multímetro.**



**7**


**Medição de Tensão CC**


Este multímetro pode ser usado para
medir tensões de CC na faixa de 0 a
1000V. Você pode usar este multímetro
para fazer qualquer medição de tensão
CC no manual de serviço do veículo.
As aplicações mais comuns são medir
quedas de tensão e verificar se a
tensão correta chegou a um sensor ou
a um determinado circuito.


Para medir Tensões CC (veja a Fig. 7):


**1.** **Insira** **o** **conector** **de** **teste**

**PRETO no conector de teste**

**COM.**


**2.** **Insira** **o** **conector** **de** **teste**


**VERMELHO em**

**conector de teste.**


**3.** **Conecte o conector de teste**
**VERMELHO ao lado positivo (+)**
**da fonte de tensão.**


**4.** **Conecte o conector de teste**
**PRETO ao lado negativo (-) da**
**fonte de tensão.**

**NOTA:** Se você não souber
qual lado é positivo (+) e qual
lado é negativo (-), conecte
arbitrariamente o conector de

teste VERMELHO em um lado e

o PRETO em outro. O multímetro

detecta automaticamente a

polaridade e exibe um sinal de
menos (-) quando a polaridade
negativa é medida. Se você trocar
os conectores de teste VERMELHO
e PRETO, a polaridade positiva
será agora indicada no visor. A
medição de tensões negativas não
causa danos ao multímetro.



**5.** **Coloque o comutador rotativo**
**do multímetro na faixa de tensão**
**desejada.**
Se a tensão aproximada for
desconhecida, comece na maior
faixa de tensão e diminua para
a faixa apropriada conforme
necessário. (Veja Definir o Alcance
na página 6)


**6.** **Veja a leitura no visor - Indique**
**a configuração do intervalo para**
**as unidades corretas.**

NOTA: 200mV = 0.2V


**Medição da Tensão CA**


Este multímetro pode ser usado para
medir tensões CA na faixa de 0 a 750V.


Para medir Tensões CA (veja a Fig. 8):


**1.** **Insira** **o** **conector** **de** **teste**

**PRETO no conector de teste**

**COM.**


**2.** **Insira** **o** **conector** **de** **teste**


**VERMELHO no**

**conector de teste.**


**3.** **Conecte o conector de teste**

**VERMELHO em um lado da fonte**

**de tensão.**


**4.** **Conecte o conector de teste**

**PRETO ao outro lado da fonte**

**de tensão.**


**5.** **Coloque o comutador rotativo**
**do multímetro na faixa de tensão**
**desejada.**
Se a tensão aproximada for
desconhecida, comece na maior
faixa de tensão e diminua para
a faixa apropriada conforme
necessário. (Veja Definir o Alcance
na página 6)


**6.** **Veja a leitura no visor - Indique**
**a configuração do intervalo para**
**as unidades corretas.**

NOTA: 200mV = 0.2V



**8**


**Medição de Resistência**


A resistência é medida em unidades elétricas
chamadas ohms (Ω). O multímetro digital
pode medir a resistência de 0.1 a 20M Ω ou
(20.000.000 ohms). A resistência infinita é
mostrada com um “1” no lado esquerdo da
tela (consulte Definir o Alcance na página
6). Você pode usar este multímetro para
fazer qualquer medição de resistência
indicada no manual de serviço do veículo.
Teste de bobinas de ignição, fios de vela e
alguns sensores do motor são usos comuns
para a função OHMS (Ω).


Para medir a resistência (veja a Fig. 9):


**1.** **Desligue a energia do circuito.**
Para obter uma medição de
resistência precisa e evitar
possíveis danos ao multímetro
digital e ao circuito elétrico em
teste, desligue toda a energia
elétrica no circuito onde a medição
de resistência está sendo feita.


**2.** **Insira** **o** **conector** **de** **teste**

**PRETO no conector de teste**

**COM.**


**3.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**

**conector de teste.**


**4.** **Coloque o comutador rotativo**
**do multímetro na faixa de 200.**

Una os conectores vermelho e
preto do multímetro e veja a leitura
no visor.
O monitor deve ler tipicamente de
0,2 a 1,5 Ω .
Se a leitura do visor for maior
que 1,5, verifique ambas as
extremidades dos terminais de
teste quanto a conexões ruins. Se
conexões ruins forem encontradas,
substitua os conectores de teste.



**5.** **Conecte** **os** **conectores** **de**

**teste VERMELHO e PRETO ao**
**componente onde você deseja**
**medir a resistência.**
Ao fazer medições de resistência,
a polaridade não é importante. Os
conectores de teste só precisam
estar conectados ao componente.


**6.** **Coloque o comutador rotativo**
**do multímetro na faixa desejada**
**do OHM.**
Se a resistência aproximada for
desconhecida, comece na maior
faixa de OHM e diminua até a faixa
apropriada, conforme necessário.
(Consulte Definir o Alcance na
página 6)


**7.** **Veja a leitura no visor - Indique**
**a configuração do intervalo para**
**as unidades corretas.**

NOTA: 2K = 2,000; 2mi = 2,
000.000 Ω
Se você quiser fazer medições de
resistência precisas, subtraia a
resistência do conector de teste

encontrada na Etapa 4 acima da
leitura da tela no Passo 7. É uma
boa ideia fazer isso para medições
de resistência inferiores a 10 Ω .


**Corrente CC de Medição**


Este multímetro pode ser usado para
medir a corrente CC na faixa de 0
a 10A. Se a corrente que você está
medindo exceder 10A, o fusível interno
queimará (consulte Substituição do
Fusível na página 7). Ao contrário das
medições de tensão e resistência em
que o multímetro está conectado ao
componente que você está testando,
as medições de corrente devem ser
feitas com o multímetro em série com
o componente. Os drenos de corrente
de isolamento e os curtos-circuitos
são algumas aplicações de corrente
contínua.


Para medir a Corrente CC (veja Figs.
10 e 11):


**1.** **Insira** **o** **conector** **de** **teste**

**PRETO no conector de teste**

**COM.**


**2.** **Insira** **o** **conector** **de** **teste**

**VERMELHO na entrada de teste**

**"10A" ou na entrada de teste**

**"mA".**



**9**


**3.** **Desconecte** **ou** **abra**

**eletricamente o circuito onde**
**você deseja medir a corrente.**
Isso é feito ao:

   - Desconectar o chicote de
fiação.

   - Desconectar o fio do terminal

do tipo rosqueado.


   - Remova a solda do

componente, se estiver
trabalhando em placas de circuito
impresso.

   - Corte o fio se não houver
outra maneira possível de abrir o
circuito elétrico.


**4.** **Conecte o conector de teste**

**VERMELHO em um dos lados do**

**circuito desconectado.**


**5.** **Conecte o conector de teste**

**PRETO ao lado restante do**

**circuito desconectado.**


**6.** **Coloque o comutador rotativo**
**do multímetro na posição 10A**
**CC ou na posição 200mA.**


**7.** **Veja a leitura no visor.**
Se o sinal de menos (-) aparecer
no visor, inverta os conectores de
teste VERMELHO e PRETO.



**Teste de Continuidade**


A continuidade é uma maneira rápida
de fazer um teste de resistência para
determinar se um circuito está aberto

ou fechado. O multímetro emitirá um
bipe quando o circuito estiver fechado
ou em curto, para que você não tenha
que olhar para a tela. As verificações
de continuidade geralmente são feitas
ao verificar se há fusíveis queimados,
operação de chave e fios abertos ou em
curto.


Para medir a Continuidade (veja a Fig. 12)


**1.** **Insira** **o** **conector** **de** **teste**

**PRETO no conector de teste**

**COM.**


**2.** **Insira** **o** **conector** **de** **teste**


**VERMELHO no**

**conector de teste.**


**3.** **Gire o comutador rotativo do**


**multímetro para** **função.**


**4.** **Una os conectores de teste**
**VERMELHO e PRETO para testar**
**a continuidade.**
Ouça o tom para verificar a
operação correta.


**5.** **Conecte** **os** **conectores** **de**

**teste VERMELHO e PRETO ao**
**componente onde você deseja**
**verificar a continuidade.**
Ouça o tom:

**•** **Se você ouvir o tom**   - o

circuito está fechado ou em curto.

**•** **Se você não ouvir o tom**, o
circuito está aberto.



**10**


**Teste de Diodos**


Um diodo é um componente elétrico que
permite que a corrente flua somente
em uma direção. Quando uma tensão
positiva, geralmente maior que 0,7V, é
aplicada ao ânodo de um diodo, o diodo
ligará e permitirá que a corrente flua. Se
esta mesma voltagem for aplicada ao
catodo, o diodo permanecerá desligado
e não fluirá corrente. Portanto, a fim de
testar um diodo, você deve verificá-lo
em ambas as direções (ou seja, anodopara-catodo e catodo-para-anodo). Os
diodos são normalmente encontrados

em alternadores em automóveis.


Realizando o Teste de Diodo (veja Fig. 13):


**1.** **Insira** **o** **conector** **de** **teste**

**PRETO no conector de teste**

**COM.**


**2.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**

**conector de teste.**


**3.** **Gire o comutador rotativo do**


**multímetro para função**


**4.** **Una os conectores de teste**
**VERMELHO e PRETO para testar**
**a continuidade.**
**Verifique a tela - deve redefinir**
**para 0. 00.**


**5.** **Desconecte uma extremidade**

**do diodo do circuito.**

O diodo deve estar totalmente
isolado do circuito para testar sua
funcionalidade.


**6.** **Conecte os conectores de teste**

**VERMELHO e PRETO ao diodo e**
**cheque o visor.**
O visor mostrará uma das três

coisas:




   - Uma queda de tensão típica
em torno de 0. 7V.

   - Uma queda de tensão de 0
volts.

   - Um “1” aparecerá
indicando que o multímetro está
sobrecarregado.


**7.** **Troque os conectores de teste**
**VERMELHO e PRETO e repita o**
**Passo 6.**


**8.** **Resultados dos Testes**


Se o visor mostrou:

   - Uma queda de tensão de 0
volts em ambas as direções, então
o diodo está em curto e precisa ser
substituído.

   - Um "1" aparece em ambas
as direções, então o diodo é
um circuito aberto e precisa ser
substituído.

   - O diodo é bom se o visor
exibir 0,5V a 0,7V em uma direção
e um “1” aparecer na outra direção,
indicando que o multímetro está
sobrecarregado.


**Medição** **de** **RPM** **do**
**Motor**


RPM significa rotações por minuto. Ao
usar esta função, você deve multiplicar
a leitura do visor por 10 para obter
o RPM real. Se o visor exibir 200 e o
multímetro estiver definido para 6 RPM
do cilindro, a RPM real do motor será 10
vezes 200 ou 2000 RPM.


Para medir a Rotação do Motor (veja a Fig. 14):


**1.** **Insira** **o** **conector** **de** **teste**

**PRETO no conector de teste**

**COM.**


**2.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**

**conector de teste.**



**11**


**3.** **Conecte o conector de teste**

**VERMELHO ao fio de sinal TACH**
**(RPM).**

   - Se o veículo for DIS (Sistema
de ignição sem Distribuidor),
conecte o conector de teste

VERMELHO ao fio de sinal TACH
que vai do módulo DIS para o
computador do motor do veículo.
(consulte o manual de serviço do
veículo para a localização deste
fio).

   - Para todos os veículos com
distribuidores, ligue o conector de
teste VERMELHO ao lado negativo
da bobina de ignição primária.
(consulte o manual de serviço
do veículo para a localização da
bobina de ignição)


**4.** **Conecte o conector de teste**

**PRETO a um bom aterramento**

**de veículo.**


**5.** **Gire** **o** **comutador** **rotativo**
**do multímetro para corrigir a**
**seleção do CILINDRO.**


**6.** **Meça** **a** **rotação** **do** **motor**
**enquanto o motor estiver em**
**marcha ou funcionando.**


**7.** **Veja a leitura no visor.**

   - Lembre-se de multiplicar a
leitura de exibição por 10 para
obter o RPM real.


Se a tela exibir 200, a RPM real do
motor será 10 vezes 200 ou 2000

RPM.


**Medição de Dwell**


A medição de Dwell foi extremamente
importante nos sistemas de ignição do
ponto de disjuntor do passado. Referiase ao período de tempo, em graus, que
os pontos do disjuntor permaneciam
fechados, enquanto a eixo de comando
girava. Os veículos de hoje usam
ignição eletrônica e o tempo de espera
não é mais ajustável. Outra aplicação
para interrupção está no teste do
solenoide de controle de mistura nos
carburadores de realimentação GM.


Para medir o Dwell (veja a Fig. 15):



**1.** **Insira** **o** **conector** **de** **teste**

**PRETO no conector de teste**

**COM.**


**2.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**

**conector de teste.**


**3.** **Conecte o conector de teste**

**VERMELHO ao fio de sinal**

**DWELL.**

   - Se estiver medindo o DWELL
nos sistemas de ignição do ponto
de disjuntor, conecte o conector de
teste VERMELHO ao lado negativo
da bobina de ignição primária.
(consulte o manual de serviço
do veículo para a localização da
bobina de ignição)

   - Se estiver medindo o DWELL

nos solenoides de controle de

mistura GM, conecte o conector de
teste VERMELHO no lado terra ou
no lado acionado pelo computador
do solenoide. (consulte o manual
de serviço do veículo para
localização do solenoide)

   - Se estiver medindo o DWELL
em qualquer dispositivo ON / OFF
arbitrário, conecte o conector
de teste VERMELHO ao lado
do dispositivo que está sendo
LIGADO/DESLIGADO.


**4.** **Conecte o conector de teste**

**PRETO a um bom aterramento**

**de veículo.**


**5.** **Gire** **o** **comutador** **rotativo**
**do multímetro para corrigir a**
**posição do CILINDRO DWELL.**


**6.** **Veja a leitura no visor.**



**12**


## **Seção 2: Teste** **Automotivo**

O multímetro digital é uma ferramenta
muito útil para solucionar problemas em
sistemas elétricos automotivos. Esta
seção descreve como usar o multímetro
digital para testar o sistema de partida
e carga, sistema de ignição, sistema
de combustível e sensores do motor.
O multímetro digital também pode ser
usado para testes gerais de fusíveis,
chaves, solenoides e relés.


**Teste Geral**


O multímetro digital pode ser usado
para testar fusíveis, chaves, solenoides
e relés.


**Teste de Fusíveis**


Este teste verifica se um fusível está
queimado. Você pode usar este teste
para verificar os fusíveis internos dentro
do multímetro digital.


Para testar os Fusíveis (veja a Fig. 16):


**1.** **Insira** **o** **conector** **de** **teste**

**PRETO no conector de teste**

**COM.**


**2.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**

**conector de teste.**


**3.** **Gire o comutador rotativo do**


**multímetro para função**


**4.** **Una os conectores de teste**
**VERMELHO e PRETO para testar**
**a continuidade.**
Ouça o tom para verificar o
funcionamento correto.


**5.** **Ligue** **os** **conectores** **de**
**teste** **VERMELHO** **e** **PRETO**



**às extremidades opostas do**
**fusível.**


Ouça o tom:

   - Se você ouvir o tom - Fusível

está bom.

   - Se você não ouvir o tom - O
fusível está queimado e precisa
ser substituído.


NOTA: Substitua sempre os
fusíveis queimados pelo mesmo
tipo e classificação.


**Chaves de Teste**


Este teste verifica se um interruptor
“abre” e “fecha” corretamente.


Para testar os Interruptores (veja a Fig. 17):


**1.** **Insira** **o** **conector** **de** **teste**

**PRETO no conector de teste**

**COM.**


**2.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**

**conector de teste.**


**3.** **Gire o comutador rotativo do**


**multímetro para função**


**4.** **Una os conectores de teste**
**VERMELHO e PRETO para testar**
**a continuidade.**
Ouça o tom para verificar o
funcionamento correto.


**5.** **Ligue o conector de teste PRETO**
**a um dos lados do interruptor.**


**6.** **Conecte o conector de teste**

**VERMELHO ao outro lado do**
**interruptor.**


Ouça o tom:

   - Se você ouvir o tom - O
interruptor está fechado.

   - Se você não ouvir o tom - O
interruptor está aberto.



**13**


**7.** **Opere o interruptor.**


Ouça o tom:

**•** **Se você ouvir o tom -** O
interruptor está fechado.

**•** **Se você não ouvir o tom -** O
interruptor está aberto.

**7.** **Repita o passo 7 para verificar a**
**operação do interruptor.**


Interruptor Bom: Tom liga e desliga
enquanto você opera o interruptor.


Interruptor Ruim: Tom sempre
LIGADO ou tom sempre
DESLIGADO enquanto você opera
o interruptor.


**Teste de Solenoides e**

**Relés**


Este teste verifica se um solenoide ou
relé tem uma bobina quebrada. Se a
bobina for boa, ainda é possível que
o relé ou o solenoide estejam com
defeito. O relé pode ter contatos que
estão soldados ou desgastados, e o
solenoide pode grudar quando a bobina
estiver energizada. Este teste não
verifica esses possíveis problemas.


Para testar Solenoides e Relés (veja a
Fig. 18):


**1.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**

**COM.**


**2.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**
**conector de teste.**

**3.** **Coloque o comutador rotativo**
**do multímetro na função 200.**



A maioria dos solenoides e

resistências da bobina do relé são
menores que 200. Se o medidor
se sobrepor, coloque o comutador
rotativo do multímetro na próxima
faixa superior. (consulte Definir o
Alcance na página 6)

**4.** **Ligue** **o** **conector** **de** **teste**
**PRETO a um lado da bobina.**


**5.** **Conecte o conector de teste**
**VERMELHO ao outro lado da**

**bobina.**


**6.** **Veja a leitura no visor.**

- As resistências típicas da bobina
do solenoide / relé são de 200 ou

menos.

- Consulte o manual de serviço do
veículo para a faixa de resistência
de seus veículos.


**7.** **Resultados dos Testes**


Solenoide bom / Bobina de relé: A
exibição na etapa 6 está dentro da
especificação do fabricante.


Solenoide Ruim / Bobina de relé:

- A exibição na Etapa 6 não está
dentro das especificações do
fabricante.

- A tela exibe o intervalo acima da

escala em cada faixa de ohms
indicando um circuito aberto.


NOTA: Alguns relés e solenoides
têm um diodo colocado através

da bobina. Para testar este diodo,
consulte Teste de Diodos na
página 11.



**14**


**Teste de Sistema de Partida / Carregamento**


O sistema de partida “vira” o motor. Consiste na bateria, motor de partida, solenoide
de partida e / ou relé e fiação e conexões associadas. O sistema de carregamento
mantém a bateria carregada quando o motor está funcionando. Este sistema consiste
no alternador, regulador de tensão, bateria e fiação e conexões associadas. O
multímetro digital é uma ferramenta útil para verificar o funcionamento desses
sistemas.

**Teste** **Sem** **Carga** **da**
**Bateria**


Antes de fazer qualquer verificação
do sistema de partida / carregamento,
você deve primeiro testar a bateria
para certificar-se de que ela esteja
totalmente carregada.



Procedimento de Teste (veja Fig. 19):


**1.** **Desligue a chave de ignição.**
**2.** **Ligue os faróis durante 10**
**segundos para dissipar a carga**
**da bateria.**
**3.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**

**COM.**
**4.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**

**conector de teste.**
**5.** **Desconecte o cabo positivo (+)**
**da bateria.**
**6.** **Ligue** **o** **conector** **de** **teste**
**VERMELHO ao terminal positivo**
**(+) da bateria.**
**7.** **Ligue** **o** **conector** **de** **teste**
**PRETO ao terminal negativo (-)**
**da bateria.**
**8.** **Coloque o comutador rotativo**
**do multímetro na faixa de 20V**

**CC.**
**9.** **Veja a leitura no visor.**
**10.** **Resultados de Teste**
Compare a leitura de exibição na
etapa 9 com o gráfico a seguir.



**15**



Se a bateria não estiver 100%
carregada, carregue-a antes de iniciar
os testes do sistema de partida /
carregamento.


**Corrente da Bateria com**

**Motor Desligado**


Este teste mede a quantidade de
corrente sendo extraída da bateria
quando a chave de ignição e o motor
estão desligados. Este teste ajuda a
identificar possíveis fontes de consumo
excessivo de corrente da bateria, o que
poderia levar a uma bateria “morta”.

**1.** **Desligue a chave de ignição e**
**todos os acessórios.**
Certifique-se de que as luzes
do porta malas, capô e cúpula
estejam todas DESLIGADAS.
(Veja Fig. 20)

**2.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**

**COM.**


**3.** **Insira** **o** **conector** **de** **teste**
**VERMELHO na entrada de teste**
**"A" (ou "mA").**


**4.** **Desconecte o cabo positivo (+)**
**da bateria.**
**5.** **Ligue** **o** **conector** **de** **teste**
**VERMELHO ao terminal positivo**
**(+) da bateria.**
**6.** **Conecte o conector de teste**
**PRETO ao cabo positivo (+) da**
**bateria.**

NOTA: Não inicie o veículo durante
este teste, pois isso pode resultar
em danos ao multímetro.
**7.** **Coloque o comutador rotativo**
**do multímetro na posição 10A**
**CC (ou 200 mA).**
**8.** **Veja a leitura no visor.**

- O consumo de corrente típico é de
100mA. (1mA = 0.001A)

- Consulte o manual de serviço
do veículo para o Consumo
de Corrente da Bateria com
Motor Desligado específico do
fabricante.
NOTA: Predefinições de
estação de rádio e relógios são
contabilizados no consumo de
corrente típico de 100mA.
**9.** **Resultados de Teste**
Consumo Normal da Corrente:
A leitura da tela na etapa 8 está
dentro das especificações do
fabricante.
Consumo Excessivo de Corrente:

   - A leitura da tela no Passo 8 está
bem fora das especificações do
fabricante.

   - Remova os fusíveis da caixa de
fusíveis um de cada vez até que
a fonte de consumo de corrente
excessiva seja localizada.
    - Circuitos sem fusíveis, como
faróis, relés e solenoides, também
devem ser verificados como
possíveis drenos de corrente na
bateria.

   - Quando a fonte de drenagem de
corrente excessiva é encontrada,
faça a manutenção conforme
necessário.

**Tensão de Partida - Teste**
**de Carga da Bateria**


Este teste verifica a bateria para ver se
está fornecendo tensão suficiente para
o motor de partida sob condições de
partida.
Procedimento de Teste (veja Fig. 21):



**16**



**1.** **Desativar o sistema de ignição**
**para que o veículo não inicie.**
Desconecte o primário da bobina
de ignição ou da bobina de coleta
do distribuidor ou o sensor de
came / manivela para desativar
o sistema de ignição. Consulte o
manual de serviço do veículo para
desabilitar o procedimento.


**2.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**

**COM.**
**3.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**

**conector de teste.**
**4.** **Ligue** **o** **conector** **de** **teste**
**VERMELHO ao terminal positivo**
**(+) da bateria.**
**5.** **Ligue** **o** **conector** **de** **teste**
**PRETO ao terminal negativo (-)**
**da bateria.**
**6.** **Coloque o comutador rotativo**
**do multímetro na faixa de 20V**

**CC.**
**7.** **Motor** **de** **manivela** **por** **15**
**segundos** **continuamente**
**enquanto observa a exibição.**
**8.** **Resultados de Teste**
Compare a leitura de exibição na
Etapa 7 com o gráfico abaixo.


**Tensão** **Temperatura**


9,6V ou superior  70 °F (21 °C) ou superior


9,5V 60 °F (15 °C)


9,4V 50 °F (10 °C)


9,3V 40 °F (4 °C)


9,1V 30 °F (-1 °C)


8,9V 20 °F (-6 °C)


8,7V 10 °F (-12 °C)


8,5V 0 °F (-17 °C)


Se a tensão no visor corresponder ao
gráfico de tensão versus temperatura
acima, o sistema de partida está normal.


Se a tensão no visor não corresponder
ao gráfico, é possível que a bateria, os
cabos da bateria, os cabos do sistema
de partida, o solenoide de partida ou o
motor de partida estejam com defeito.

**Quedas de tensão**


Este teste mede a queda de tensão
entre fios, chaves, cabos, solenoides
e conexões. Com este teste você pode
encontrar resistência excessiva no
sistema de partida. Essa resistência
restringe a quantidade de corrente que
atinge o motor de partida, resultando
em baixa tensão de carga da bateria e
um motor de partida lento na partida.

Procedimento de Teste (veja Fig. 22):
**1.** **Desative o sistema de ignição**
**para que o veículo não inicie.**
Desconecte o primário da bobina
de ignição ou a bobina de coleta
do distribuidor ou o sensor de
came / manivela para desativar
o sistema de ignição. Consulte o
manual de serviço do veículo para
desabilitar o procedimento.
**2.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**

**COM.**
**3.** **Insira** **o** **conector** **de** **teste**

**VERMELHO no**

**conector de teste.**
**4.** **Conecte os conectores de teste.**
Consulte o Circuito Típico de Perda
de Tensão de Partida (Fig. 22).




- Conecte os conectores de

teste VERMELHO e PRETO

alternadamente entre 1 e 2, 2 e 3, 4
e 5, 5 e 6, 6 e 7, 7 e 9, 8 e 9 e 8 e 10.
**5.** **Coloque o comutador rotativo**
**do multímetro na faixa de 200.**
Se o multímetro se sobrepor, gire o
comutador rotativo do multímetro
para a faixa de 2V CC. (Consulte
Definir o alcance na página 6)
**6.** **Dê partida no motor até a leitura**
**constante estar em exibição.**

- Registre os resultados em cada ponto,
conforme exibido no multímetro.

- Repita os passos 4 e 5 até
que todos os pontos estejam
marcados.
7. **Resultado dos testes**

**Queda de tensão estimada dos**
**componentes do circuito de**
**partida**


- Compare as leituras de tensão na
etapa 6 com o gráfico acima.

- Se alguma tensão for alta,
inspecione o componente e a
conexão quanto a defeitos.

- Se forem encontrados defeitos, faça
a manutenção conforme necessário.



**17**


**Teste de Tensão**

**do Sistema de**
**Carregamento**


Este teste verifica o sistema de
carregamento para ver se ele carrega
a bateria e fornece energia para o
restante dos sistemas elétricos do
veículo (luzes, ventilador, rádio, etc.).


Procedimento de Teste (veja Fig. 23):


**1.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**

**COM.**
**2.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**

**conector de teste.**
**3.** **Ligue** **o** **conector** **de** **teste**
**VERMELHO ao terminal positivo**
**(+) da bateria.**
**4.** **Ligue** **o** **conector** **de** **teste**
**PRETO ao terminal negativo (-)**
**da bateria.**
**5.** **Coloque o comutador rotativo**
**do multímetro na faixa de 20V**

**CC.**
**6.** **Dê partida no motor - deixe em**
**marcha lenta.**
**7.** **Desligue todos os acessórios e**
**visualize a leitura no visor.**

  - O sistema de carregamento
está normal se a tela mostrar de

13,2 a 15,2 volts.

  - Se a tensão de exibição não
estiver entre 13,2 a 15,2 volts,
prossiga para o Passo 13.



**8.** **Ative o acelerador e mantenha**
**a rotação do motor (RPM) entre**
**1800 e 2800 RPM.**
Segure esta velocidade até o
Passo 11 - Tenha uma ajuda para
manter a velocidade.
**9.** **Veja a leitura no visor.**
A leitura de tensão não deve

mudar do passo 7 em mais de
0,5V.
**10.** **Carregue o sistema elétrico**
**ligando as luzes, os limpadores**
**de para-brisa e ajustando o**
**ventilador para cima.**
**11.** **Veja a leitura no visor.**
A tensão não deve cair abaixo de

13,0V.
**12.** **Desligue todos os acessórios,**
**retorne o motor para a marcha**
**lenta e desligue.**
**13.** **Resultados de Teste**

  - Se as leituras de tensão

nos Passos 7, 9 e 11 forem
as esperadas, o sistema de
carregamento é normal.

  - Se quaisquer leituras de
tensão nas etapas 7, 9 e 11 forem
diferentes das mostradas aqui ou
no manual de serviço do veículo,
verifique se há uma correia do
alternador solta, um regulador ou
alternador com defeito, conexões
fracas ou a corrente de campo do
alternador aberta.

  - Consulte o manual de
serviço do veículo para obter mais
diagnósticos.



**18**


**Teste do Sistema de Ignição**


O sistema de ignição é responsável por fornecer a faísca que inflama o combustível
no cilindro. Os componentes do sistema de ignição que o multímetro digital pode
testar são a resistência primária e secundária da bobina de ignição, resistência do
fio da vela de ignição, interruptores / sensores de efeito hall, sensores da bobina de
captação de relutância e a ação de comutação da bobina de ignição primária.



**Teste da Bobina de**

**Ignição**


Este teste mede a resistência do
primário e secundário de uma bobina de
ignição. Este teste pode ser usado para
sistemas de ignição sem distribuidor
(DIS), desde que os terminais primários
e secundários da bobina de ignição
sejam facilmente acessíveis.

Procedimento de Teste:
**1.** **Se o motor estiver QUENTE,**
**deixe-o** **esfriar** **antes** **de**

**continuar.**
**2.** **Desconecte a bobina de ignição**
**do sistema de ignição.**
**3.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**
**COM (veja a Fig. 24).**


**4.** **Insira o conector**
**de** **teste**

**VERMELHO** **no**


**teste**

**conector.**
**5.** **Coloque** **o**
**comutador**

**rotativo** **do**

**multímetro** **na**

**faixa de 200** (Ω) **.**
**6.** **Una os conectores**
**vermelho e preto**
**do multímetro e**
**veja a leitura no**



**visor.**
**7.** **Conecte os conectores de teste.**

  - Conecte o conector de teste
VERMELHO ao terminal positivo
(+) da bobina de ignição primária.

  - Ligue o conector de teste
PRETO ao terminal negativo (-) da
bobina de ignição primária.

  - Consulte o manual de serviço
do veículo para obter a localização
dos terminais da bobina de ignição
primária.
**8.** **Veja a leitura no visor.**

Subtraia a resistência do conector
de teste encontrada no passo 6 da
leitura acima.
**9.** **Se o veículo for DIS, repita os**
**passos 7 e 8 para as bobinas de**
**ignição restantes.**


**10** **Resultados** **do**

**Teste - Bobina Primária**

      - A faixa típica de
resistência das bobinas
de ignição primária é de
0. 3 - 2.0.

      - Consulte o
manual de serviço do
veículo para a faixa
de resistência de seus

veículos.
**11.** **Coloque** **o**
**comutador rotativo do**

**multímetro na faixa de**
**200K (veja a Fig. 25).**



**19**


**12.** **Mova** **o** **conector** **de** **teste**
**VERMELHO para o terminal da**
**bobina de ignição secundária.**

  - Consulte o manual de serviço
do veículo para localização do
terminal da bobina de ignição
secundária.

  - Verifique se o conector de
teste PRETO está conectado ao
terminal negativo (-) da bobina de
ignição primária.
**13.** **Veja a leitura no visor.**
**14.** **Se o veículo for DIS, repita os**
**passos 12 e 13 para as bobinas**
**de ignição restantes.**
**15.** **Resultados do Teste - Bobina**
**Secundária**

  - A faixa típica de resistência
das bobinas de ignição
secundárias é de 6,0 a 30,0.

  - Consulte o manual de
serviço do veículo para a faixa de
resistência de seus veículos.
**16.** **Repita o procedimento de teste**
**para uma bobina de ignição A**
**QUENTE.**
NOTA: É uma boa ideia testar
as bobinas de ignição quando
estiverem quentes e frias, porque
a resistência da bobina pode
mudar com a temperatura. Isso
também ajudará no diagnóstico de
problemas no sistema de ignição
intermitente.
**17.** **Resultados de Teste - Geral**

Bobina de Ignição Boa: As leituras
de resistência nos Passos 10,
15 e 16 estavam dentro das
especificações do fabricante.

Bobina de Ignição Ruim: As
leituras de resistência nos Passos

10, 15 e 16 não estavam dentro
das especificações do fabricante.



**20**


**Fios do Sistema de**

**Ignição**


Este teste mede a resistência dos fios
da vela de ignição e da torre da bobina
enquanto estão sendo flexionados. Este
teste pode ser usado para sistemas de
ignição sem distribuidor (DIS), desde
que o sistema não monte a bobina de
ignição diretamente na vela de ignição.


Procedimento de Teste:


**1.** **Remova os fios do sistema de**
**ignição, um de cada vez, do**
**motor.**

  - Torça as botas cerca de meia
volta, puxando gentilmente para
removê-las.

  - Consulte o manual de serviço
do veículo para o procedimento de
remoção do fio de ignição.

  - Inspecione os fios de ignição
quanto a rachaduras, isolamento
irregular e extremidades corroídas.

**NOTA:** Alguns produtos da Chrysler
usam um fio de vela de eletrodo com

terminal de "bloqueio positivo". Esses
fios só podem ser removidos de dentro
da tampa do distribuidor. Pode ocorrer
dano se outros meios de remoção forem
tentados. Consulte o manual de serviço
do veículo para o procedimento.


**NOTA:** Alguns fios de velas têm
jaquetas de chapa metálica com o
seguinte símbolo: Este tipo de fio
contém um resistor “de ar” e só pode
ser verificado com um osciloscópio.

**2.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**
**COM (veja a Fig. 26).**
**3.** **Insira** **o** **conector** **de** **teste**


**VERMELHO em**

**conector de teste.**



**4.** **Conecte o conector de teste**
**VERMELHO a uma extremidade**
**do fio de ignição e o conector**
**de** **teste** **PRETO** **à** **outra**

**extremidade.**
**5.** **Coloque o comutador rotativo**
**do multímetro na faixa de 200K.**
**6.** **Veja** **a** **leitura** **em** **exibição**
**enquanto flexiona o fio de**
**ignição em vários lugares.**

  - A faixa de resistência típica é
de 3K a 50K ou aproximadamente
10K por pé de fio.

  - Consulte o manual de
serviço do veículo para a faixa de
resistência de seus veículos.

  - Conforme você flexiona o fio
de ignição, a tela deve permanecer
estável.
**7.** **Resultados dos Testes**

Fio de Ignição Bom: A leitura do
visor está dentro da especificação
do fabricante e permanece estável
enquanto o fio é flexionado.

Fio de Ignição Ruim: A leitura do
visor muda de forma incorreta
quando o fio de ignição é
flexionado ou a leitura do visor
não está dentro da especificação
do fabricante.



**21**


**Sensores de Efeito Hall /**

**Interruptores**


Os sensores de efeito Hall são usados
sempre que o computador do veículo
precisa saber a velocidade e a posição
de um objeto em rotação. Sensores de
efeito Hall são comumente usados em
sistemas de ignição para determinar
a posição do eixo de cames e do
virabrequim, de modo que o computador
do veículo saiba o melhor momento
para disparar a(s) bobina(s) de ignição
e ligar os injetores de combustível. Este
teste verifica a operação correta do
sensor / interruptor de efeito Hall.


Procedimento de Teste (veja Fig. 27):

**1.** **Remova o sensor de efeito Hall**
**do veículo.**

Consulte o manual de serviço do
veículo para o procedimento.
**2.** **Conecte a bateria de 9V aos**
**pinos** **de** **ALIMENTAÇÃO** **e**
**ATERRAMENTO do sensor.**

  - Conecte o terminal positivo
(+) da bateria de 9V ao pino de
ALIMENTAÇÃO do sensor.

  - Conecte o terminal negativo
(-) da bateria de 9V ao sensor do
pino de ATERRAMENTO.

  - Consulte as ilustrações
das localizações dos
pinos de ALIMENTAÇÃO e
ATERRAMENTO.

  - Para sensores não ilustrados,
consulte o manual de manutenção
do veículo quanto à localização
dos pinos.
**3.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**

**COM.**



**4.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**

**conector de teste.**
**5.** **Conecte o conector de teste**
**VERMELHO ao pino de SINAL**
**do sensor.**
**6.** **Ligue** **o** **conector** **de** **teste**
**PRETO ao pino negativo (-) da**
**bateria de 9V.**
**7.** **Gire o comutador rotativo do**
**multímetro para função.**

O multímetro deve soar um tom.
**8.** **Deslize uma lâmina plana de**
**ferro ou aço magnético entre o**
**sensor e o ímã.** (Use um pedaço
de metal, lâmina de faca, régua de
aço, etc.)

  - O tom do multímetro
deve parar e a exibição deve
ultrapassar.

  - Remova a lâmina de aço e o
multímetro novamente deve soar

um tom.

  - Tudo bem se a exibição for
alterada incorretamente após a
remoção da lâmina de metal.

  - Repita várias vezes para
verificar os resultados.
**9** **Resultados dos Testes**

Sensor Bom: O multímetro alterna
do tom para o overrange quando
a lâmina de aço é inserida e
removida.

Sensor Ruim: Nenhuma mudança
no multímetro como a lâmina de
aço é inserida e removida.



**22**


**Bobinas Magnéticas**
**de Recolhimento -**

**Sensores de Relutância**


Os sensores de relutância são usados
sempre que o computador do veículo
precisa saber a velocidade e a posição
de um objeto em rotação. Sensores de
relutância são comumente usados em
sistemas de ignição para determinar
a posição do eixo de cames e do
virabrequim, de modo que o computador
do veículo saiba o melhor momento
para disparar a(s) bobina(s) de ignição
e ligar os injetores de combustível. Este
teste verifica o sensor de relutância

quanto a uma bobina aberta ou em
curto. Este teste não verifica a folga de
ar ou a saída de tensão do sensor.


Procedimento de Teste (ver Fig. 28):


**1.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**

**COM.**
**2.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**

**conector de teste**



**3.** **Ligue** **o** **conector** **de** **teste**
**VERMELHO ao pino do sensor.**
**4.** **Ligue o conector de teste PRETO**
**ao pino do sensor restante.**
**5.** **Coloque o comutador rotativo**
**do multímetro na faixa de 2K.**
**6.** **Veja** **a** **leitura** **em** **exibição**
**enquanto flexiona os fios do**
**sensor em vários lugares.**

  - A faixa de resistência típica é
de 150 a 1000.

  - Consulte o manual de
serviço do veículo para a faixa de
resistência de seus veículos.

  - Conforme você flexiona os

fios do sensor, o monitor deve
permanecer estável.
**7.** **Resultados dos Testes**

Sensor Bom: A leitura do visor
está dentro das especificações do

fabricante e permanece estável
enquanto os fios do sensor
estão flexionados.

Sensor Ruim: A leitura do
visor muda de forma irregular
conforme os fios do sensor

são flexionados ou a leitura

do visor não está dentro da
especificação do fabricante.



**23**


**Ação de Troca de Bobina**
**de Ignição**


Este teste verifica se o terminal
negativo da bobina de ignição primária
está sendo ligado e desligado através
do módulo de ignição e dos sensores
de posição da árvore de cames /
virabrequim. Esta ação de comutação é
onde o sinal RPM ou TACH se origina.
Este teste é usado principalmente para
uma condição de “não dá partida”.

Procedimento de Teste (ver Fig. 29):


**1.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**

**COM.**
**2.** **Insira** **o** **conector** **de** **teste**


**VERMELHO no**
**conector de teste.**
**3.** **Ligue** **o** **conector** **de** **teste**
**VERMELHO ao fio de sinal**

**TACH.**

  - Se o veículo for DIS (Sistema
de Ignição sem Distribuidor),
conecte o conector de teste

VERMELHO ao fio de sinal TACH
que vai do módulo DIS para o
computador do motor do veículo.
(consulte o manual de serviço do
veículo para a localização deste
fio)




  - Para todos os veículos com
distribuidores, ligue o conector de
teste VERMELHO ao lado negativo
da bobina de ignição primária.
(consulte o manual de serviço
do veículo para a localização da
bobina de ignição)
**4.** **Conecte o conector de teste**
**PRETO a um bom aterramento**

**de veículo.**
**5.** **Gire** **o** **comutador** **rotativo**
**do multímetro para corrigir a**
**seleção do CILINDRO em RPM.**
**6.** **Veja a leitura no visor**
**enquanto o motor está trocando**
**de marcha.**

  - O intervalo de RPM de
arranque típico é de 50-275 RPM,
dependendo da temperatura,
tamanho do motor e condição da
bateria.

  - Consulte o manual de serviço
do veículo para a faixa específica
de RPMs de partida do veículo.

**7.** **Resultado de Teste**

Ação de troca de bobina
boa: A leitura do visor indicou um valor
consistente com as especificações do
fabricante.

Ação de troca de bobina ruim:

- O visor exibe zero RPM,
significando que a bobina de
ignição não está sendo ligada e
desligada.

- Verifique o sistema de ignição
quanto a defeitos na fiação e teste
os sensores do eixo de cames e

do virabrequim.



**24**


## **Teste do Sistema de Combustível**

Os requisitos para emissões mais
baixas de veículos aumentaram a

necessidade de um controle mais
preciso do combustível do motor.
Os fabricantes de automóveis
começaram a usar carburadores
controlados eletronicamente em

1980 para atender aos requisitos de
emissões. Os veículos modernos
de hoje usam injeção eletrônica
de combustível para controlar
com precisão o combustível e
reduzir ainda mais as emissões.
O multímetro digital pode ser
usado para testar o solenoide de
controle de mistura de combustível

nosveículos da General Motors e
para medir a resistência do injetor
de combustível.


**Testando o Dwell Solenoide de Controle de Mistura GM C-3**



Este solenoide está localizado no

carburador. Sua finalidade é manter
uma relação ar / combustível de 14,7
para 1, a fim de reduzir as emissões.
Este teste verifica se a folga do
solenoide está variando.

Descrição de teste:

Este teste é bastante longo e detalhado.
Consulte o manual de serviço do
veículo para o procedimento de teste
completo. Alguns procedimentos de
teste importantes que você precisa
prestar muita atenção estão listados
abaixo.

**1.** **Certifique-se de que o motor**
**esteja** **em** **temperatura**
**operacional** **e** **funcionando**
**durante o teste.**



**2.** **Consulte o manual de serviço**
**do veículo para obter instruções**
**sobre a conexão do multímetro.**

**3.** **Coloque o comutador rotativo**
**do multímetro na posição de 6**
**Cilindros Dwell para todos os**
**veículos da GM.**

**4.** **Execute o motor a 3000 RPM.**

**5.** **Faça o motor executar tanto**
**RICH quanto LEAN.**
**6.** **Veja a exibição do multímetro.**

**7.** **O visor do multímetro deve**
**variar de 10 ° a 50 ° enquanto o**
**veículo muda de lean para rich** .



**25**


**Medição da Resistência**
**do Injetor de**
**Combustível**


Os injetores de combustível são
semelhantes aos solenoides. Eles
contêm uma bobina que é ligada e
desligada pelo computador do veículo.
Este teste mede a resistência desta
bobina para se certificar de que não é
um circuito aberto. As bobinas em curto
também podem ser detectadas se a
resistência específica do fabricante do
injetor de combustível for conhecida.

Procedimento de Teste (veja Fig. 30):


**1.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**

**COM.**
**2.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**

**conector de teste.**
**3.** **Coloque o comutador rotativo**
**do multímetro na faixa de 200.**

Una os conectores vermelho e
preto do multímetro e veja a leitura
no visor.

O visor deve ler tipicamente de 0,2
a 1. 5 Ω.

Se a leitura do visor for maior
que 1,5 Ω, verifique ambas as
extremidades dos terminais de
teste quanto a conexões ruins. Se
conexões ruins forem encontradas,
substitua os conectores de teste.
**4.** **Desconecte o chicote elétrico**
**do injetor de combustível -**
**Consulte o manual de serviço**
**do veículo para o procedimento.**



**5.** **Conecte** **os** **conectores** **de**
**teste** **VERMELHO** **e** **PRETO**
**através dos pinos do injetor de**
**combustível.**

Certifique-se de conectar os
terminais de teste no injetor de
combustível e **não** no chicote de
fiação.
**6.** **Coloque o comutador rotativo**
**do multímetro na faixa desejada**
**do OHM.**
Se a resistência aproximada for
desconhecida, comece no maior
intervalo de OHM e diminua para
o intervalo apropriado, conforme
necessário. (consulte Definir o

Alcance na página 6)
**7. Veja a leitura no visor -**
**Indique a configuração do**
**intervalo para as unidades**
**corretas.**

   - Se a leitura da tela for 10 ou
menos,, subtraia a resistência
do conector de teste encontrada

na Etapa 3 da leitura acima.

   - Compare a leitura com as
especificações do fabricante
quanto à resistência da bobina
do injetor de combustível.

- Esta informação é encontrada no
manual de serviço do veículo.
**8.** **Resultados dos Testes**
Resistência boa do Injetor de
Combustível: A resistência da
bobina do injetor de combustível
está dentro das especificações do
fabricante.
Resistência ruim do Injetor de
Combustível: A resistência da
bobina do injetor de combustível
não está dentro das especificações
do fabricante.

**NOTA:** Se a resistência da
bobina do injetor de combustível
estiver dentro das especificações
do fabricante, o injetor de
combustível ainda pode estar com
defeito. É possível que o injetor
de combustível esteja entupido
ou sujo e isso esteja causando o
problema de dirigibilidade.



**26**


## **Teste de Sensores do Motor**



No início dos anos 80, controles de computador foram instalados em veículos
para atender às regulamentações do Governo Federal para reduzir as emissões e
melhorar a economia de combustível. Para fazer o seu trabalho, um motor controlado
por computador usa sensores eletrônicos para descobrir o que está acontecendo no
motor. O trabalho do sensor é pegar algo que o computador precisa saber, como a
temperatura do motor, e convertê-lo em um sinal elétrico que o computador possa
entender. O multímetro digital é uma ferramenta útil para verificar a operação do

sensor.

**4.** **Insira** **o** **conector** **de** **teste**

**Sensores do Tipo**
**Oxigênio (O2)** **VERMELHO** **no**



**4.** **Insira** **o** **conector** **de** **teste**



**VERMELHO** **no**

**conector de teste**



O sensor de oxigênio produz uma tensão
ou resistência com base na quantidade
de oxigênio no fluxo de escape. Uma
voltagem baixa (alta resistência) indica
uma exaustão enxuta (muito oxigênio),
enquanto uma alta voltagem (baixa
resistência) indica uma exaustão rica
(oxigênio insuficiente). O computador
usa essa voltagem para ajustar a
relação ar / combustível. Os dois tipos
de sensores de O2 comumente usados

são Zirconia e Titania. Consulte a
ilustração para diferenças de aparência
dos dois tipos de sensores.

Procedimento de Teste (ver Fig. 31):
**1.** **Se o motor estiver QUENTE,**
**deixe-o** **esfriar** **antes** **de**

**continuar.**
**2.** **Remova o sensor de oxigênio**
**do veículo.**
**3.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**

**COM.**



**5.** **Teste do circuito do aquecedor.**

  - Se o sensor tiver 3 ou mais
fios, o seu veículo usa um sensor
de O2 aquecido.

  - Consulte o manual de serviço
do veículo para localização dos
pinos do aquecedor.

  - Ligue o conector de teste
VERMELHO ao pino do aquecedor.



**27**


   - Ligue o conector de teste
PRETO ao pino do aquecedor
restante.

   - Coloque o comutador rotativo
do multímetro na faixa de 200.

   - Veja a leitura no visor.

   - Compare a leitura com as
especificações do fabricante no
manual de serviço do veículo.

   - Remova os dois terminais de

teste do sensor.

**6.** **Ligue o conector de teste PRETO**
**ao pino de ATERRAMENTO do**

**sensor.**

   - Se o sensor for de 1 ou 3
fios, então o ATERRAMENTO é a
carcaça do sensor.

   - Se o sensor for de 2 ou 4 fios,
então o ATERRAMENTO está no

chicote do sensor.

   - Consulte o manual de serviço
do veículo para o diagrama de
fiação do Sensor de Oxigênio.

**7.** **Conecte o conector de teste**
**VERMELHO ao pino de SINAL**
**do sensor.**

**8.** **Teste do Sensor de Oxigênio.**

   - Ligue o comutador rotativo
do multímetro para ...

**-** Faixa de 2V para sensores tipo
Zirconia.

**-** Faixa de 200K para sensores tipo
Titania.

   - Acenda a tocha de propano.

   - Segure firmemente o sensor
com um alicate de travamento.

   - Aqueça completamente a
ponta do sensor o mais quente
possível, mas não "brilhando".
A ponta do sensor deve estar a
660°F (348°C) para funcionar.

   - Contorne completamente
a ponta do sensor com a chama
para esgotar o sensor de oxigênio
(Condição Rich).

   - O visor do multímetro deve

ler ...

**-** 0.6V ou superior para sensores
do tipo Zirconia.

**-** um valor Ohmico (Resistência)



para Sensores do tipo Titania. A
leitura irá variar com a temperatura
da chama.

   - Enquanto ainda aplica calor
ao sensor, mova a chama de
tal forma que o oxigênio possa
alcançar a ponta do sensor
(Condição Lean).

   - O visor do multímetro deve

ler ...

**-** 0.4V ou inferior para sensores do
tipo Zirconia.

**-** uma condição fora da escala
para Sensores do tipo Titania.
(Consulte Definir o alcance na
página 6.)

**9.** **Repita o passo 8 algumas vezes**
**para verificar os resultados.**

**10. Extinga a chama, deixe o sensor**

**esfriar e remova os terminais de**

**teste.**

**11. Resultados de Teste**

Sensor Bom:

   - Resistência do circuito
do aquecedor está dentro das
especificações do fabricante.

   - Sinal de saída do sensor de
oxigênio alterado quando exposto
a uma condição rich e lean.

Sensor Ruim:

   - Resistência do circuito do
aquecedor não está dentro das
especificações do fabricante.

   - O sinal de saída do sensor
de oxigênio não mudou quando
exposto a uma condição rich e
lean.

   - A tensão de saída do
sensor de oxigênio leva mais de
3 segundos para mudar de uma
condição rich para uma condição
lean.

**Sensores de Tipo de**
**Temperatura**


Um sensor de temperatura é um
termistor ou um resistor cuja resistência
muda com a temperatura. Quanto
mais quente o sensor fica, menor a
resistência se torna. As aplicações
típicas do termistor são sensores



**28**


de refrigeração do motor, sensores
de temperatura do ar de admissão,
sensores de temperatura do fluido da
transmissão e sensores de temperatura
do óleo.

Procedimento de Teste (ver Fig. 32):


**1.** **Se o motor estiver QUENTE,**
**deixe-o** **esfriar** **antes** **de**
**continuar.**

Certifique-se de que todos os
fluidos do motor e da transmissão
estejam na temperatura externa
antes de continuar com este teste!
**2.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**

**COM.**
**3.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**
**conector de teste.**
**4.** **Desconecte o chicote de fiação**
**do sensor.**
**5.** **Se estiver testando o sensor de**
**temperatura do ar de admissão -**
**remova-o do veículo.**

Todos os outros sensores de

temperatura podem permanecer
no veículo para testes.
**6.** **Ligue** **o** **conector** **de** **teste**
**VERMELHO ao pino do sensor.**
**7.** **Ligue o conector de teste PRETO**
**ao pino do sensor restante.**
**8.** **Coloque o comutador rotativo**
**do multímetro na faixa desejada**
**do OHM.**
Se a resistência aproximada for
desconhecida, comece na maior
faixa de OHM e diminua até a faixa
apropriada, conforme necessário.
(Consulte Definir o alcance na
página 6)
**9.** **Ver e registrar a leitura no visor.**



**10.** **Desconecte os conectores de**
**teste do multímetro do sensor e**
**reconecte a fiação do sensor.**

Este passo não se aplica aos
sensores de temperatura do ar
de admissão. Para sensores de
temperatura do ar de admissão,
deixe os conectores de teste

multímetro ainda conectados ao

sensor.
**11.** **Aquecer o sensor.**

Se estiver testando o sensor de
temperatura do ar de admissão:

  - Para aquecer a ponta do
sensor de imersão do sensor em
água fervente ou ...

  - Aqueça a ponta com um
isqueiro se a ponta do sensor
for de metal ou um secador de
cabelo se a ponta do sensor for de
plástico.

  - Veja e grave a menor leitura
no visor, à medida que o sensor é
aquecido.

  - Talvez seja necessário
diminuir o intervalo para obter uma
leitura mais precisa.

  - Para todos os outros

sensores de temperatura:

  - Ligue o motor e deixe-o em
marcha lenta até a mangueira do
radiador superior estar quente.

  - Desligue a chave de ignição.

  - Desconecte o chicote de

cabos do sensor e reconecte os

conectores de teste do multímetro.

  - Ver e registrar a leitura no
visor.
**12.** **Resultados de Teste**

Sensor bom:


  - A resistência QUENTE
dos sensores de temperatura é
pelo menos 300 menor que sua
resistência FRIA.

  - O ponto chave é que a
resistência QUENTE diminui com
o aumento da temperatura.

Sensor Ruim:


  - Não há alteração entre a
resistência FRIA do sensor de
temperatura e a resistência FRIA.

  - O sensor de temperatura é
um circuito aberto ou curto.



**29**


**Sensores de Tipo de**
**Posição**


Os sensores de posição são
potenciômetros ou um tipo de resistor
variável. Eles são usados pelo
computador para determinar a posição
e a direção do movimento de um
dispositivo mecânico. As aplicações
típicas do sensor de posição são
sensores de posição do acelerador,
sensores de posição da válvula EGR e
sensores de fluxo de ar da aleta.

Procedimento de Teste (veja Fig. 33):


**1.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**

**COM.**
**2.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**

**conector de teste.**
**3.** **Desconecte o chicote de fiação**
**do sensor.**
**4.** **Conecte os conectores de teste.**

  - Conecte o conector de
teste VERMELHO ao pino
ALIMENTAÇÃO do sensor.

  - Ligue o conector de
teste PRETO ao pino de
ATERRAMENTO do sensor.

  - Consulte o manual de serviço
do veículo para localização
dos pinos ALIMENTAÇÃO e
ATERRAMENTO do sensor.
**5.** **Coloque o comutador rotativo**
**do multímetro na faixa de 20K.**
**6.** **Veja e registre a leitura no visor.**

  - O monitor deve ler algum
valor de resistência.




  - Se o multímetro estiver
sobrecarregado, ajuste o intervalo
de acordo. (Consulte Definir o
Alcance na página 6.)

  - Se o multímetro se sobrepor
na maior faixa, então o sensor é
um circuito aberto e está com

defeito.
**7.** **Mova** **o** **conector** **de** **teste**
**VERMELHO para o pino SINAL**
**do sensor.**

  - Consulte o manual de serviço
do veículo para localização do
pino SINAL do sensor.

**8. Opere o sensor.**

Sensor de posição do acelerador:

   - Mova lentamente a
articulação do acelerador da
posição fechada para a posição
de abertura máxima.

   - Dependendo da conexão, a
leitura do visor aumentará ou

diminuirá a resistência.

   - A leitura da tela deve
começar ou terminar no valor
aproximado da resistência
medido na etapa 6.

   - Alguns sensores de posição
do acelerador possuem um
interruptor de aceleração de
marcha lenta ou de aceleração
máxima (WOT), além de um
potenciômetro.

  - Para testar esses
interruptores, siga o procedimento
Teste de Interruptores na página
13.

  - Quando lhe for dito para
operar o interruptor, mova a
articulação do acelerador.

  - Sensor de fluxo de ar da

aleta:

  - Lentamente abra a "porta"
da aleta de fechada para aberta,
empurrando-a com um lápis
ou objeto similar. Isso não irá
prejudicar o sensor.

  - Dependendo da conexão,
a leitura da tela aumentará ou

diminuirá a resistência.

  - A leitura da tela deve
começar ou terminar no valor
aproximado da resistência medido
na etapa 6.



**30**


  - Alguns sensores de fluxo
de ar da aleta possuem um
interruptor de marcha lenta e
um sensor de temperatura do
ar de admissão, além de um
potenciômetro.

  - Para testar o interruptor
inativo, consulte Teste de
Interruptores na página 13.

  - Quando lhe for dito para
operar o interruptor, abra a
"porta" da aleta.

  - Para testar o sensor de
temperatura do ar de admissão,
consulte Sensores de Tipo de
Temperatura na página 29.

  - Posição da Válvula EGR

  - Remova a mangueira de
vácuo da válvula EGR.

  - Conecte a bomba de

vácuo manual à válvula EGR.

  - Gradualmente aplique
vácuo para abrir lentamente a
válvula. (Normalmente, 5 a 10
pol. de vácuo abre totalmente
a válvula.)

  - Dependendo da conexão,
a leitura da tela aumentará ou

diminuirá a resistência.

  - A leitura da tela deve
começar ou terminar no valor
aproximado da resistência
medido na etapa 6.
**9.** **Resultados de Teste**

Sensor Bom: A leitura do visor
aumenta gradualmente ou diminui
a resistência quando o sensor é
aberto e fechado.
Sensor Ruim: Não há alteração
na resistência quando o sensor é
aberto ou fechado.
**Sensores de Pressão**
**Absoluta de Coletor**
**(MAP) e Pressão**
**Barométrica (BARO)**


Este sensor envia um sinal ao
computador, indicando a pressão
atmosférica e / ou o vácuo do motor.
Dependendo do tipo de sensor MAP, o
sinal pode ser uma tensão CC ou uma
frequência. GM, Chrysler, Honda e
Toyota usam um sensor MAP de tensão
CC, enquanto a Ford usa um tipo de
frequência. Para outros fabricantes,
consulte o manual de serviço do veículo
para o tipo de sensor MAP utilizado.



Procedimento de Teste (ver Fig. 34):
**1.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**

**COM.**
**2.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**

**conector de teste.**


**3.** **Desconecte o chicote elétrico e**
**a linha de vácuo do sensor MAP.**
**4.** **Conecte o fio do jumper entre o**
**pino A no chicote elétrico e no**

**sensor.**
**5.** **Conecte outro fio de jumper**
**entre o Pino C no chicote**

**elétrico e o sensor.**
**6.** **Ligue** **o** **conector** **de** **teste**
**VERMELHO ao sensor Pino B.**
**7.** **Ligue** **o** **conector** **de** **teste**
**PRETO a um bom aterramento**

**do veículo.**
**8.** **Certifique-se** **de** **que** **os**
**conectores de teste e os fios do**
**jumper não estejam tocando um**
**no outro.**
**9.** **Conecte uma bomba de vácuo**
**manual à porta de vácuo no**
**sensor MAP.**
**10.** **Ative a chave de ignição, mas**
**não ligue o motor!**



**31**


**11.** **Gire o comutador rotativo do**
**multímetro para ...**

  - Alcance de 20V para
sensores MAP tipo CC.

  - 4 Posição do RPM do cilindro
para sensores MAP do tipo
Frequência.
**12.** **Veja a leitura no visor.**

Sensor do Tipo Volts CC:

  - Verifique se a bomba de
vácuo manual está a 0 pol. de
vácuo.

  - A leitura do visor deve ser

de aproximadamente 3V ou 5V,
dependendo do fabricante do
sensor MAP.
Sensor de Tipo de Frequência:

  - Verifique se a bomba de
vácuo manual está a 0 pol. de
vácuo.

  - A leitura do visor deve ser de

aproximadamente 4770 RPM ± 5%
apenas para os sensores MAP da
Ford.

  - Para outros sensores MAP
do tipo de frequência, consulte o
manual de manutenção do veículo
para as especificações do sensor
MAP.

  - Tudo bem se os dois
últimos dígitos do visor mudarem
ligeiramente enquanto o vácuo é
mantido constante.

  - Lembre-se de multiplicar a
leitura de exibição por 10 para
obter o RPM real.

  - Para converter RPM em
Frequência ou vice-versa, use a
equação abaixo.
**Frequência = RPM/30**
(Equação válida apenas para multímetro
em 4 posições de rotação do cilindro)
**13.** **Opere o sensor.**

  - Lentamente, aplique vácuo
no sensor MAP - Nunca exceda 20
polegadas de vácuo, pois podem
ocorrer danos no sensor MAP.

  - A leitura do visor deve
diminuir em voltagem ou RPM,
pois o vácuo no sensor MAP é
aumentado.

  - Consulte o manual de serviço
do veículo para obter gráficos
relacionados à queda de tensão e



frequência para aumentar o vácuo
do motor.

  - Use a equação acima para
conversões de frequência e
rotação.
**14.** **Resultados de Teste.**

Sensor Bom:

  - A tensão ou frequência de
saída do sensor (RPM) está dentro
das especificações do fabricante a
0 pol. de vácuo.

  - A tensão ou frequência de
saída do sensor (RPM) diminui
com o aumento do vácuo.
Sensor Ruim:

  - A tensão ou frequência de
saída do sensor (RPM) não está
dentro das especificações do
fabricante a 0 pol. de vácuo.

  - A tensão ou frequência de
saída do sensor (RPM) não muda
com o aumento do vácuo.
**Sensores de Fluxo de Ar**
**de Massa (Mass Air Flow**

**- MAF)**


Este sensor envia um sinal ao computador
indicando a quantidade de ar que entra no
motor. Dependendo do design do sensor,
o sinal pode ser um tipo de tensão CC,
baixa frequência ou alta frequência. **O**
**multímetro só pode testar a tensão**
**CC e o tipo de baixa frequência de**
**sensores MAF.** Os sensores do tipo de
alta frequência emitem uma frequência
muito alta para o multímetro medir. O tipo
de alta frequência MAF é um sensor de 3
pinos usado em 1989 e veículos GM mais
novos. Consulte o manual de serviço do
veículo para o tipo de sensor MAF que
seu veículo utiliza.

Procedimento de Teste (veja Fig. 35):
**1.** **Insira** **o** **conector** **de** **teste**
**PRETO no conector de teste**

**COM.**
**2.** **Insira** **o** **conector** **de** **teste**


**VERMELHO** **no**

**conector de teste.**
**3.** **Ligue** **o** **conector** **de** **teste**
**PRETO a um bom aterramento**

**do veículo.**
**4.** **Ligue** **o** **conector** **de** **teste**
**VERMELHO ao fio de sinal MAF.**

  - Consulte o manual de serviço
do veículo para localização do fio
de sinal MAF.

  - Você pode ter que fazer um
backprobe ou furar o fio de sinal



**32**


MAF para fazer a conexão.

  - Consulte o manual de serviço
do veículo para obter a melhor
maneira de se conectar ao fio de

sinal MAF.
**5.** **Ative a chave de ignição, mas**
**não ligue o motor!**
**6.** **Gire o comutador rotativo do**
**multímetro para...**

  - Alcance de 20V para
sensores MAF tipo CC.


  - Posição RPM de 4 cilindros
para sensores MAF do tipo
Frequência Baixa.
**7.** **Veja a leitura no visor.**

Sensor do Tipo Volts CC:

  - A leitura do visor deve ser de

aproximadamente 1V ou menos,
dependendo do fabricante do
sensor MAF.
Sensor do Tipo de Frequência Baixa:

  - A leitura do visor deve ser de

aproximadamente 330RPM ± 5%
**para os sensores GM MAF de**
**Baixa Frequência.**

  - Para outros sensores MAF de
baixa frequência, consulte o manual
de manutenção do veículo para as
especificações do sensor MAF.

  - Tudo bem se os dois últimos
dígitos do visor mudarem um



pouco enquanto a tecla está
ligada.

  - Lembre-se de multiplicar a
leitura de exibição por 10 para
obter o RPM real.

  - Para converter RPM em
Frequência ou vice-versa, use a
equação abaixo.
**Frequência = RPM/30**
**8.** **Opere o Sensor.**

  - Ligue o motor e deixe-o em
marcha lenta.

  - A leitura do visor deve ...

  - aumentar na tensão do Key
On Engine OFF para sensores
MAF tipo CC.

  - aumentar em RPM de Key
On Engine OFF para sensores
MAF do tipo Frequência Baixa.

  - Acelerar Motor.

  - A leitura do visor deve ...
**-** aumentar na tensão de Inativo
para sensores MAF tipo CC.
**-** aumentar em RPM dos sensores
MAF do tipo Inativo para
Frequência Baixa.

  - Consulte o manual de
serviço do veículo para obter
gráficos relacionados à tensão ou
frequência do sensor MAF (RPM)
para aumentar o fluxo de ar.

  - Use a equação acima para
conversões de frequência e
rotação.
**9.** **Resultados de Teste**
Sensor Bom:

  - A tensão ou frequência de
saída do sensor (RPM) está dentro
das especificações do fabricante no
Key ON Engine OFF.

  - A tensão ou frequência de
saída do sensor (RPM) aumentam
com o aumento do fluxo de ar.
Sensor Ruim:

  - A tensão ou frequência de
saída do sensor (RPM) não estão
dentro das especificações do
fabricante no Key ON Engine OFF.

  - A tensão ou frequência de
saída do sensor (RPM) não se altera
com o aumento do fluxo de ar.
**10.** **Manutenção**
Limpe periodicamente o gabinete
com um pano úmido e detergente
neutro. Não use produtos abrasivos
ou solventes.



**33**


**Especificações Elétricas**


**Volts CC**

Faixa: 200mV, 2V, 20V, 200V
Precisão: ±(0.5% rdg + 5 dgts)


Faixa: 1000V
Precisão: ±(0.8% rdg + 5 dgts)


**Volts CA**

Faixa: 2V, 20V, 200V
Precisão: ±(0.8% rdg + 5 dgts)


Faixa: 750V
Precisão: ±(1.0% rdg + 4 dgts)


**Corrente CC**

Faixa: 200mA
Precisão: ±(0.8% rdg + 5 dgts)


Faixa: 10A
Precisão: ±(1.2% rdg + 5 dgts)


**Resistência**

Faixa: 200Ω, 2KΩ, 20KΩ, 200KΩ, 2MΩ
Precisão: ±(0.8% rdg + 5 dgts)


Faixa: 20MΩ
Precisão: ±(1.5% rdg + 5 dgts)


**Dwell**

Faixa: 4CYL, 6CYL, 8CYL
Precisão: ±(3.0% rdg + 5 dgts)


**RPM**

Faixa: 4CYL, 6CYL, 8CYL
Precisão: ±(3.0% rdg + 5 dgts)


**Continuidade Audível**

Campainha soa em aproximadamente
menos de 30-50 Ohms.



**Temperatura de operação:**
32°F~104°F (0°C~40°C)


Umidade relativa:

0°C~30°C <75%, 31°C~40°C<50%


Temperatura de Armazenamento:
14°F~122°F (-10°C~50°C)


Pressão barométrica: 75 à 106 kPa.


O Medidor é apenas para uso interno.
**Para assistência técnica, entrar em**
**contato com:**

Robert Bosch Limitada
Telefone: 0800-704-5446



**34**


© Robert Bosch Limitada
Via Anhangüera, Km 98
13065-900 Campinas - SP
Brasil
573864 Rev A


