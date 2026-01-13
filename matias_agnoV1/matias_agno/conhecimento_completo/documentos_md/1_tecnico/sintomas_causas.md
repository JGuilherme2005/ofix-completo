{
  "sintomas": [
    {
      "id": 1,
      "sintoma": "Carro não liga ao girar a chave",
      "categoria": "Elétrica",
      "possiveis_causas": [
        {
          "causa": "Bateria descarregada ou no fim da vida útil",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Medir tensão da bateria com multímetro (deve ser >12.4V). Verificar se as luzes do painel acendem fracamente ou não acendem",
          "solucao": "Recarregar ou substituir a bateria. Verificar alternador"
        },
        {
          "causa": "Motor de partida com defeito",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Ao girar a chave, verificar se há um clique único (solenoide) mas o motor não gira, ou se não há som algum",
          "solucao": "Substituir ou reconstruir o motor de partida"
        },
        {
          "causa": "Problema no comutador de ignição",
          "probabilidade": "Baixa",
          "gravidade": "Média",
          "verificacao": "Verificar se há energia chegando ao motor de partida quando a chave é girada",
          "solucao": "Substituir o comutador de ignição"
        }
      ]
    },
    {
      "id": 2,
      "sintoma": "Motor falhando e luz de injeção acesa",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Velas de ignição gastas ou sujas",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Usar scanner OBD2 para identificar códigos P0300-P0304. Inspecionar visualmente as velas",
          "solucao": "Substituir o jogo de velas de ignição"
        },
        {
          "causa": "Bobinas de ignição com defeito",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Testar resistência das bobinas com multímetro. Scanner identifica cilindro específico",
          "solucao": "Substituir a bobina defeituosa"
        },
        {
          "causa": "Injetores de combustível entupidos",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Verificar padrão de pulverização dos injetores em bancada de teste",
          "solucao": "Limpeza ultrassônica dos injetores ou substituição"
        }
      ]
    },
    {
      "id": 3,
      "sintoma": "Barulho de rangido ao frear",
      "categoria": "Freios",
      "possiveis_causas": [
        {
          "causa": "Pastilhas de freio gastas",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Inspeção visual das pastilhas. Espessura deve ser maior que 3mm",
          "solucao": "Substituir o jogo de pastilhas de freio"
        },
        {
          "causa": "Disco de freio com superfície irregular ou oxidado",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Verificar superfície do disco visualmente e ao tato",
          "solucao": "Retificar ou substituir os discos de freio"
        }
      ]
    },
    {
      "id": 4,
      "sintoma": "Carro puxando para um lado ao dirigir",
      "categoria": "Direção",
      "possiveis_causas": [
        {
          "causa": "Pneus com calibragem irregular",
          "probabilidade": "Alta",
          "gravidade": "Baixa",
          "verificacao": "Verificar pressão de todos os pneus com calibrador",
          "solucao": "Calibrar todos os pneus conforme especificação do fabricante"
        },
        {
          "causa": "Desalinhamento da geometria",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Realizar teste de alinhamento em equipamento específico",
          "solucao": "Fazer alinhamento e balanceamento"
        },
        {
          "causa": "Freio travando de um lado",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Verificar temperatura das rodas após dirigir. Lado mais quente indica freio travado",
          "solucao": "Revisar sistema de freios, substituir cilindro ou pinça com defeito"
        }
      ]
    },
    {
      "id": 5,
      "sintoma": "Fumaça branca densa saindo do escapamento",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Junta do cabeçote queimada",
          "probabilidade": "Alta",
          "gravidade": "Crítica",
          "verificacao": "Verificar se há bolhas no reservatório de água com motor ligado. Teste de compressão e análise de gases no líquido de arrefecimento",
          "solucao": "Substituir junta do cabeçote. Retificar cabeçote se necessário"
        },
        {
          "causa": "Cabeçote empenado ou trincado",
          "probabilidade": "Média",
          "gravidade": "Crítica",
          "verificacao": "Medição de planicidade do cabeçote com régua e calibrador",
          "solucao": "Retificar ou substituir o cabeçote"
        }
      ]
    },
    {
      "id": 6,
      "sintoma": "Volante vibrando em alta velocidade",
      "categoria": "Suspensão",
      "possiveis_causas": [
        {
          "causa": "Rodas desbalanceadas",
          "probabilidade": "Alta",
          "gravidade": "Baixa",
          "verificacao": "Testar em balanceadora. Verificar se há perda de pesos de balanceamento",
          "solucao": "Balancear as rodas dianteiras"
        },
        {
          "causa": "Pneus com deformação ou desgaste irregular",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Inspeção visual e tátil dos pneus. Verificar desgaste irregular",
          "solucao": "Substituir pneus danificados"
        },
        {
          "causa": "Componentes da suspensão com folga",
          "probabilidade": "Baixa",
          "gravidade": "Alta",
          "verificacao": "Levantar o veículo e testar folgas nos pivôs e terminais",
          "solucao": "Substituir componentes com folga"
        }
      ]
    },
    {
      "id": 7,
      "sintoma": "Pedal de freio mole ou esponjoso",
      "categoria": "Freios",
      "possiveis_causas": [
        {
          "causa": "Ar no sistema hidráulico de freios",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Pedal afunda gradualmente ao ser pressionado",
          "solucao": "Fazer sangria completa do sistema de freios"
        },
        {
          "causa": "Vazamento de fluido de freio",
          "probabilidade": "Alta",
          "gravidade": "Crítica",
          "verificacao": "Verificar nível do reservatório e procurar manchas de fluido nas rodas e linhas",
          "solucao": "Localizar e reparar vazamento. Substituir componente defeituoso"
        },
        {
          "causa": "Cilindro mestre com defeito",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Verificar se há vazamento interno no cilindro mestre",
          "solucao": "Substituir o cilindro mestre"
        }
      ]
    },
    {
      "id": 8,
      "sintoma": "Barulho de estalo ao virar o volante",
      "categoria": "Direção",
      "possiveis_causas": [
        {
          "causa": "Junta homocinética desgastada",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Verificar estado da coifa de borracha. Testar virando o volante totalmente para os lados",
          "solucao": "Substituir a junta homocinética ou semi-eixo completo"
        },
        {
          "causa": "Pivô ou terminal de direção com folga",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Levantar o veículo e testar movimento dos componentes da direção",
          "solucao": "Substituir pivô ou terminal com folga"
        }
      ]
    },
    {
      "id": 9,
      "sintoma": "Consumo excessivo de combustível",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Sensor de oxigênio (sonda lambda) com defeito",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Scanner OBD2 para códigos P0130-P0141. Verificar leitura do sensor em tempo real",
          "solucao": "Substituir sensor de oxigênio"
        },
        {
          "causa": "Filtro de ar sujo ou obstruído",
          "probabilidade": "Alta",
          "gravidade": "Baixa",
          "verificacao": "Inspeção visual do filtro de ar",
          "solucao": "Substituir filtro de ar"
        },
        {
          "causa": "Injetores vazando ou pulverizando incorretamente",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Teste de vazamento e padrão de pulverização em bancada",
          "solucao": "Limpar ou substituir injetores"
        },
        {
          "causa": "Velas de ignição gastas",
          "probabilidade": "Média",
          "gravidade": "Baixa",
          "verificacao": "Inspeção visual das velas. Verificar abertura e desgaste dos eletrodos",
          "solucao": "Substituir jogo de velas"
        }
      ]
    },
    {
      "id": 10,
      "sintoma": "Ar condicionado não gela",
      "categoria": "Elétrica",
      "possiveis_causas": [
        {
          "causa": "Gás refrigerante baixo ou vazado",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Verificar pressão do sistema com manômetro específico",
          "solucao": "Localizar e reparar vazamento. Recarregar sistema com gás"
        },
        {
          "causa": "Compressor do ar condicionado com defeito",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Verificar se a embreagem do compressor está acionando. Testar pressão de saída",
          "solucao": "Substituir compressor"
        },
        {
          "causa": "Condensador obstruído",
          "probabilidade": "Média",
          "gravidade": "Baixa",
          "verificacao": "Inspeção visual do condensador (na frente do radiador)",
          "solucao": "Limpar ou substituir condensador"
        }
      ]
    },
    {
      "id": 11,
      "sintoma": "Batida seca na suspensão ao passar em lombadas",
      "categoria": "Suspensão",
      "possiveis_causas": [
        {
          "causa": "Amortecedores gastos ou sem óleo",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Teste de compressão manual. Verificar vazamento de óleo no amortecedor",
          "solucao": "Substituir par de amortecedores"
        },
        {
          "causa": "Batente do amortecedor rompido",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Inspeção visual do batente de borracha",
          "solucao": "Substituir batente"
        },
        {
          "causa": "Barra estabilizadora com folga nas buchas",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Verificar estado das buchas e movimento da barra",
          "solucao": "Substituir buchas da barra estabilizadora"
        }
      ]
    },
    {
      "id": 12,
      "sintoma": "Marcha dura para engatar",
      "categoria": "Transmissão",
      "possiveis_causas": [
        {
          "causa": "Embreagem desgastada ou desregulada",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Verificar ponto de acionamento da embreagem. Testar se há arraste",
          "solucao": "Ajustar ou substituir kit de embreagem"
        },
        {
          "causa": "Cabo da embreagem esticado ou travando",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Verificar curso livre do pedal e estado do cabo",
          "solucao": "Ajustar ou substituir cabo da embreagem"
        },
        {
          "causa": "Óleo da transmissão inadequado ou degradado",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Verificar nível e viscosidade do óleo do câmbio",
          "solucao": "Trocar óleo da transmissão com especificação correta"
        }
      ]
    },
    {
      "id": 13,
      "sintoma": "Luz de óleo acesa no painel",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Nível de óleo baixo",
          "probabilidade": "Alta",
          "gravidade": "Crítica",
          "verificacao": "Verificar nível de óleo na vareta com motor frio",
          "solucao": "Completar nível de óleo. Investigar possível vazamento ou consumo"
        },
        {
          "causa": "Bomba de óleo com defeito",
          "probabilidade": "Média",
          "gravidade": "Crítica",
          "verificacao": "Medir pressão de óleo com manômetro",
          "solucao": "Substituir bomba de óleo"
        },
        {
          "causa": "Sensor de pressão de óleo com defeito",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Testar pressão real com manômetro. Se pressão estiver normal, sensor está defeituoso",
          "solucao": "Substituir sensor de pressão de óleo"
        }
      ]
    },
    {
      "id": 14,
      "sintoma": "Carro esquentando acima do normal",
      "categoria": "Arrefecimento",
      "possiveis_causas": [
        {
          "causa": "Válvula termostática travada fechada",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Testar abertura da válvula em água quente. Verificar se mangueira superior do radiador esquenta",
          "solucao": "Substituir válvula termostática"
        },
        {
          "causa": "Nível baixo de líquido de arrefecimento",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Verificar nível no reservatório de expansão",
          "solucao": "Completar nível e investigar vazamentos"
        },
        {
          "causa": "Bomba d'água com defeito",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Verificar vazamento no selo da bomba. Testar circulação do líquido",
          "solucao": "Substituir bomba d'água"
        },
        {
          "causa": "Radiador entupido ou com colmeias obstruídas",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Inspeção visual externa. Teste de fluxo interno",
          "solucao": "Limpeza ou substituição do radiador"
        }
      ]
    },
    {
      "id": 15,
      "sintoma": "Barulho de chiado agudo ao acelerar",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Correia do alternador frouxa ou gasta",
          "probabilidade": "Alta",
          "gravidade": "Baixa",
          "verificacao": "Inspeção visual da correia. Testar tensão pressionando com o dedo",
          "solucao": "Ajustar tensão ou substituir correia"
        },
        {
          "causa": "Rolamento do alternador ou tensor com defeito",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Usar estetoscópio automotivo para localizar origem do ruído",
          "solucao": "Substituir componente com rolamento defeituoso"
        }
      ]
    },
    {
      "id": 16,
      "sintoma": "Vidro elétrico não sobe",
      "categoria": "Elétrica",
      "possiveis_causas": [
        {
          "causa": "Motor do vidro elétrico queimado",
          "probabilidade": "Alta",
          "gravidade": "Baixa",
          "verificacao": "Aplicar tensão diretamente no motor. Verificar se gira",
          "solucao": "Substituir motor do vidro elétrico"
        },
        {
          "causa": "Fusível queimado",
          "probabilidade": "Média",
          "gravidade": "Baixa",
          "verificacao": "Verificar fusível correspondente na caixa de fusíveis",
          "solucao": "Substituir fusível"
        },
        {
          "causa": "Interruptor do vidro com defeito",
          "probabilidade": "Média",
          "gravidade": "Baixa",
          "verificacao": "Testar continuidade do interruptor com multímetro",
          "solucao": "Substituir interruptor"
        }
      ]
    },
    {
      "id": 17,
      "sintoma": "Trepidação ao frear em alta velocidade",
      "categoria": "Freios",
      "possiveis_causas": [
        {
          "causa": "Disco de freio empenado",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Medir variação lateral do disco com relógio comparador",
          "solucao": "Retificar ou substituir discos de freio"
        },
        {
          "causa": "Pastilhas de freio com aplicação irregular",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Verificar desgaste irregular das pastilhas",
          "solucao": "Substituir pastilhas e retificar discos"
        }
      ]
    },
    {
      "id": 18,
      "sintoma": "Partida difícil pela manhã (motor diesel)",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Velas de aquecimento (velas incandescentes) com defeito",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Testar resistência elétrica de cada vela com multímetro",
          "solucao": "Substituir velas de aquecimento defeituosas"
        },
        {
          "causa": "Bateria fraca",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Testar tensão da bateria. Motor diesel exige mais corrente na partida",
          "solucao": "Recarregar ou substituir bateria"
        }
      ]
    },
    {
      "id": 19,
      "sintoma": "Vazamento de óleo embaixo do carro",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Junta do cárter danificada ou mal instalada",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Limpar região e verificar origem exata do vazamento",
          "solucao": "Substituir junta do cárter"
        },
        {
          "causa": "Retentor do virabrequim vazando",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Verificar acúmulo de óleo na parte traseira do motor",
          "solucao": "Substituir retentor"
        },
        {
          "causa": "Tampa de válvulas com vazamento",
          "probabilidade": "Média",
          "gravidade": "Baixa",
          "verificacao": "Verificar acúmulo de óleo na parte superior do motor",
          "solucao": "Substituir junta da tampa de válvulas"
        }
      ]
    },
    {
      "id": 20,
      "sintoma": "Barulho de apito ou assobio no motor",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Turbina (turbocompressor) com defeito",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Verificar folga axial da turbina. Inspecionar vazamento de óleo",
          "solucao": "Reconstruir ou substituir turbina"
        },
        {
          "causa": "Vazamento no sistema de admissão de ar",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Teste de fumaça no sistema de admissão",
          "solucao": "Reparar vazamento em mangueiras ou conexões"
        }
      ]
    },
    {
      "id": 21,
      "sintoma": "Direção pesada",
      "categoria": "Direção",
      "possiveis_causas": [
        {
          "causa": "Nível baixo de fluido da direção hidráulica",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Verificar nível no reservatório da direção hidráulica",
          "solucao": "Completar nível e investigar vazamentos"
        },
        {
          "causa": "Bomba da direção hidráulica com defeito",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Verificar ruído anormal da bomba. Testar pressão de saída",
          "solucao": "Substituir bomba da direção hidráulica"
        },
        {
          "causa": "Correia da direção hidráulica frouxa",
          "probabilidade": "Média",
          "gravidade": "Baixa",
          "verificacao": "Verificar tensão da correia",
          "solucao": "Ajustar ou substituir correia"
        }
      ]
    },
    {
      "id": 22,
      "sintoma": "Luz do ABS acesa no painel",
      "categoria": "Freios",
      "possiveis_causas": [
        {
          "causa": "Sensor de velocidade da roda sujo ou danificado",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Scanner para ler código de falha específico. Limpar sensores",
          "solucao": "Limpar ou substituir sensor defeituoso"
        },
        {
          "causa": "Módulo ABS com defeito",
          "probabilidade": "Baixa",
          "gravidade": "Alta",
          "verificacao": "Diagnóstico com scanner específico para ABS",
          "solucao": "Substituir ou reparar módulo ABS"
        }
      ]
    },
    {
      "id": 23,
      "sintoma": "Marchas pulando sozinhas durante a condução",
      "categoria": "Transmissão",
      "possiveis_causas": [
        {
          "causa": "Sincronizador desgastado",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Identificar qual marcha está pulando. Teste de engate",
          "solucao": "Retificar câmbio e substituir sincronizadores"
        },
        {
          "causa": "Óleo da transmissão inadequado ou degradado",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Verificar especificação e estado do óleo",
          "solucao": "Trocar óleo com especificação correta"
        }
      ]
    },
    {
      "id": 24,
      "sintoma": "Cheiro forte de combustível dentro do carro",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Vazamento em mangueira ou conexão de combustível",
          "probabilidade": "Alta",
          "gravidade": "Crítica",
          "verificacao": "Inspeção visual com motor ligado. Verificar mangueiras e conexões",
          "solucao": "Substituir mangueira ou apertar conexões. RISCO DE INCÊNDIO"
        },
        {
          "causa": "Injetor vazando combustível",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Verificar vazamento externo nos injetores",
          "solucao": "Substituir injetor ou vedações"
        }
      ]
    },
    {
      "id": 25,
      "sintoma": "Motor morrendo em marcha lenta",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Corpo de borboleta sujo",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Inspeção visual do corpo de borboleta",
          "solucao": "Limpeza do corpo de borboleta com produto específico"
        },
        {
          "causa": "Sensor de rotação (IAC) com defeito",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Scanner OBD2 para código P0505. Testar motor de passo",
          "solucao": "Limpar ou substituir válvula IAC"
        },
        {
          "causa": "Vazamento de vácuo",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Teste de fumaça para localizar vazamentos",
          "solucao": "Reparar vazamento em mangueiras ou juntas"
        }
      ]
    },
    {
      "id": 26,
      "sintoma": "Barulho metálico tipo batida dentro do motor",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Folga nos tuchos ou balancins",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Usar estetoscópio automotivo na tampa de válvulas",
          "solucao": "Ajustar folga das válvulas ou substituir tuchos"
        },
        {
          "causa": "Corrente ou correia de comando com folga",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Verificar tensão da corrente/correia de comando",
          "solucao": "Substituir corrente/correia e tensor"
        },
        {
          "causa": "Biela ou pino do pistão com folga (motor batendo)",
          "probabilidade": "Baixa",
          "gravidade": "Crítica",
          "verificacao": "Som metálico grave que aumenta com a rotação",
          "solucao": "Retífica completa do motor"
        }
      ]
    },
    {
      "id": 27,
      "sintoma": "Faróis queimando com frequência",
      "categoria": "Elétrica",
      "possiveis_causas": [
        {
          "causa": "Regulador de voltagem do alternador com defeito",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Medir tensão do alternador. Não deve ultrapassar 14.5V",
          "solucao": "Substituir alternador ou regulador de voltagem"
        },
        {
          "causa": "Mau contato no soquete da lâmpada",
          "probabilidade": "Média",
          "gravidade": "Baixa",
          "verificacao": "Verificar oxidação ou folga no soquete",
          "solucao": "Limpar ou substituir soquete"
        }
      ]
    },
    {
      "id": 28,
      "sintoma": "Freio de mão não segura o carro em rampa",
      "categoria": "Freios",
      "possiveis_causas": [
        {
          "causa": "Cabo do freio de mão esticado ou desregulado",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Verificar curso da alavanca do freio de mão",
          "solucao": "Ajustar tensão do cabo"
        },
        {
          "causa": "Lonas do freio de mão gastas",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Inspeção das lonas traseiras",
          "solucao": "Substituir lonas do freio de estacionamento"
        }
      ]
    },
    {
      "id": 29,
      "sintoma": "Fumaça azulada saindo do escapamento",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Retentores de válvula gastos",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Fumaça azul principalmente ao acelerar após desaceleração. Verificar consumo de óleo",
          "solucao": "Substituir retentores de válvula"
        },
        {
          "causa": "Anéis do pistão gastos",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Teste de compressão. Fumaça azul constante",
          "solucao": "Retífica do motor com substituição de anéis"
        },
        {
          "causa": "Turbina vazando óleo para a admissão",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Verificar presença de óleo no duto de admissão",
          "solucao": "Reconstruir ou substituir turbina"
        }
      ]
    },
    {
      "id": 30,
      "sintoma": "Barulho de chocalho ou lata embaixo do carro",
      "categoria": "Escapamento",
      "possiveis_causas": [
        {
          "causa": "Suporte do escapamento quebrado ou solto",
          "probabilidade": "Alta",
          "gravidade": "Baixa",
          "verificacao": "Inspeção visual do sistema de escapamento",
          "solucao": "Substituir suporte ou borracha de fixação"
        },
        {
          "causa": "Catalisador com colmeia interna solta",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Bater levemente no catalisador e ouvir barulho interno",
          "solucao": "Substituir catalisador"
        }
      ]
    },
    {
      "id": 31,
      "sintoma": "Limpador de para-brisa não funciona",
      "categoria": "Elétrica",
      "possiveis_causas": [
        {
          "causa": "Motor do limpador queimado",
          "probabilidade": "Alta",
          "gravidade": "Baixa",
          "verificacao": "Aplicar tensão diretamente no motor. Verificar se gira",
          "solucao": "Substituir motor do limpador"
        },
        {
          "causa": "Fusível queimado",
          "probabilidade": "Média",
          "gravidade": "Baixa",
          "verificacao": "Verificar fusível do limpador",
          "solucao": "Substituir fusível"
        },
        {
          "causa": "Chave de comando do limpador com defeito",
          "probabilidade": "Média",
          "gravidade": "Baixa",
          "verificacao": "Testar continuidade da chave",
          "solucao": "Substituir chave de comando"
        }
      ]
    },
    {
      "id": 32,
      "sintoma": "Carro vibrando em ponto morto com motor ligado",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Coxim do motor quebrado ou desgastado",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Inspeção visual dos coxins. Testar movimento excessivo do motor",
          "solucao": "Substituir coxim defeituoso"
        },
        {
          "causa": "Motor com marcha lenta irregular",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Verificar rotação em marcha lenta. Deve ser estável",
          "solucao": "Diagnosticar causa da marcha lenta irregular (velas, injetores, etc)"
        }
      ]
    },
    {
      "id": 33,
      "sintoma": "Dificuldade para dar partida com motor quente",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Sensor de temperatura do motor com defeito",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Scanner OBD2 código P0115-P0118. Verificar leitura do sensor",
          "solucao": "Substituir sensor de temperatura"
        },
        {
          "causa": "Bomba de combustível com defeito intermitente",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Testar pressão de combustível a quente",
          "solucao": "Substituir bomba de combustível"
        }
      ]
    },
    {
      "id": 34,
      "sintoma": "Barulho ao passar em buracos ou lombadas",
      "categoria": "Suspensão",
      "possiveis_causas": [
        {
          "causa": "Barra estabilizadora com folga nas buchas",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Testar movimento manual da barra. Verificar estado das buchas",
          "solucao": "Substituir buchas da barra estabilizadora"
        },
        {
          "causa": "Amortecedor com batente rompido",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Inspeção visual do batente superior",
          "solucao": "Substituir batente ou kit completo do amortecedor"
        },
        {
          "causa": "Bandeja de suspensão com bucha gasta",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Verificar folga nas buchas da bandeja",
          "solucao": "Substituir buchas ou bandeja completa"
        }
      ]
    },
    {
      "id": 35,
      "sintoma": "Luz de airbag acesa no painel",
      "categoria": "Elétrica",
      "possiveis_causas": [
        {
          "causa": "Sensor de impacto com defeito ou desconectado",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Scanner específico para sistema de airbag",
          "solucao": "Reconectar ou substituir sensor"
        },
        {
          "causa": "Fio rompido no chicote do airbag",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Teste de continuidade nos chicotes",
          "solucao": "Reparar chicote"
        },
        {
          "causa": "Módulo do airbag com defeito",
          "probabilidade": "Baixa",
          "gravidade": "Alta",
          "verificacao": "Diagnóstico com scanner específico",
          "solucao": "Substituir módulo do airbag"
        }
      ]
    },
    {
      "id": 36,
      "sintoma": "Aceleração fraca ou motor sem força",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Filtro de combustível entupido",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Testar pressão da linha de combustível",
          "solucao": "Substituir filtro de combustível"
        },
        {
          "causa": "Filtro de ar obstruído",
          "probabilidade": "Alta",
          "gravidade": "Baixa",
          "verificacao": "Inspeção visual do filtro",
          "solucao": "Substituir filtro de ar"
        },
        {
          "causa": "Sensor MAF (fluxo de ar) sujo ou com defeito",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Scanner OBD2 código P0101. Limpar sensor",
          "solucao": "Limpar ou substituir sensor MAF"
        },
        {
          "causa": "Catalisador entupido",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Medir contrapressão do escapamento",
          "solucao": "Substituir catalisador"
        }
      ]
    },
    {
      "id": 37,
      "sintoma": "Vazamento de água no carpete interno",
      "categoria": "Arrefecimento",
      "possiveis_causas": [
        {
          "causa": "Dreno do ar condicionado entupido",
          "probabilidade": "Alta",
          "gravidade": "Baixa",
          "verificacao": "Verificar se há água acumulada no evaporador",
          "solucao": "Desobstruir dreno do ar condicionado"
        },
        {
          "causa": "Radiador do ar condicionado (evaporador) vazando",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Verificar se o líquido é água ou fluido refrigerante",
          "solucao": "Substituir evaporador"
        },
        {
          "causa": "Núcleo do aquecedor vazando",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Verificar se o líquido tem cheiro adocicado (líquido de arrefecimento)",
          "solucao": "Substituir núcleo do aquecedor"
        }
      ]
    },
    {
      "id": 38,
      "sintoma": "Barulho de ronco que aumenta com a velocidade",
      "categoria": "Direção",
      "possiveis_causas": [
        {
          "causa": "Rolamento de roda com defeito",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Levantar o veículo e girar a roda. Verificar folga e ruído",
          "solucao": "Substituir rolamento da roda"
        },
        {
          "causa": "Pneu com desgaste irregular",
          "probabilidade": "Média",
          "gravidade": "Baixa",
          "verificacao": "Inspeção visual do padrão de desgaste",
          "solucao": "Substituir pneu e fazer alinhamento"
        }
      ]
    },
    {
      "id": 39,
      "sintoma": "Fumaça preta saindo do escapamento",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Mistura rica - excesso de combustível",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Scanner OBD2 para verificar trim de combustível negativo",
          "solucao": "Diagnosticar causa (injetores, sensor MAP, sensor O2)"
        },
        {
          "causa": "Filtro de ar obstruído",
          "probabilidade": "Média",
          "gravidade": "Baixa",
          "verificacao": "Inspeção visual do filtro",
          "solucao": "Substituir filtro de ar"
        },
        {
          "causa": "Injetores sujos ou vazando",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Teste de vazamento e padrão de pulverização",
          "solucao": "Limpar ou substituir injetores"
        }
      ]
    },
    {
      "id": 40,
      "sintoma": "Painel de instrumentos apagado ou com falhas",
      "categoria": "Elétrica",
      "possiveis_causas": [
        {
          "causa": "Fusível do painel queimado",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Verificar fusível específico do painel de instrumentos",
          "solucao": "Substituir fusível"
        },
        {
          "causa": "Problema no quadro de instrumentos",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Verificar alimentação elétrica chegando no painel",
          "solucao": "Reparar ou substituir quadro de instrumentos"
        },
        {
          "causa": "Mau contato no conector do painel",
          "probabilidade": "Média",
          "gravidade": "Baixa",
          "verificacao": "Verificar conexões no painel",
          "solucao": "Limpar e reconectar"
        }
      ]
    }
  ]
}
