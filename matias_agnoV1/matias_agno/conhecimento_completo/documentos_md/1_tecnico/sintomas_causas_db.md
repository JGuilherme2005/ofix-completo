{
  "sintomas": [
    {
      "id": 1,
      "sintoma": "Motor não pega, só faz um 'clique' ao girar a chave.",
      "categoria": "Elétrica",
      "possiveis_causas": [
        {
          "causa": "Bateria descarregada ou com baixa capacidade de CCA.",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Medir tensão da bateria (deve ser > 12.4V) e testar com carga (teste de CCA).",
          "solucao": "Recarregar ou substituir a bateria."
        },
        {
          "causa": "Falha no solenoide ou motor de partida (arranque).",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Testar a queda de tensão no motor de partida durante a tentativa de ignição.",
          "solucao": "Reparar ou substituir o motor de partida."
        }
      ]
    },
    {
      "id": 2,
      "sintoma": "Carro 'morre' em marcha lenta ou ao parar no semáforo.",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Corpo de borboleta (TBI) sujo ou com carbonização excessiva.",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Inspeção visual do TBI e leitura dos parâmetros de controle de marcha lenta (IAC) via scanner.",
          "solucao": "Limpeza e reaprendizagem do TBI."
        },
        {
          "causa": "Vazamento de vácuo no coletor de admissão ou mangueiras ressecadas.",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Teste de vácuo no coletor e inspeção visual/auditiva de mangueiras. Verificar *Fuel Trims* altos.",
          "solucao": "Substituir mangueiras ou juntas do coletor danificadas."
        }
      ]
    },
    {
      "id": 3,
      "sintoma": "Fumaça branca densa e doce saindo do escapamento.",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Queima de líquido de arrefecimento (água) na câmara de combustão.",
          "probabilidade": "Alta",
          "gravidade": "Crítica",
          "verificacao": "Teste de CO2 no reservatório de expansão e inspeção do nível de água.",
          "solucao": "Substituição da junta do cabeçote ou reparo do cabeçote/bloco."
        }
      ]
    },
    {
      "id": 4,
      "sintoma": "Fumaça azulada saindo do escapamento, especialmente em desacelerações ou partidas.",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Retentores de válvulas endurecidos ou gastos.",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Fumaça mais intensa após longos períodos em marcha lenta ou ao dar a primeira partida.",
          "solucao": "Substituição dos retentores de válvulas."
        },
        {
          "causa": "Anéis de segmento (pistão) gastos ou travados.",
          "probabilidade": "Média",
          "gravidade": "Crítica",
          "verificacao": "Teste de compressão e teste de vazamento de cilindro.",
          "solucao": "Retífica do motor ou substituição dos anéis/pistões."
        }
      ]
    },
    {
      "id": 5,
      "sintoma": "Fumaça preta saindo do escapamento e cheiro forte de combustível.",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Excesso de combustível (mistura rica) devido a injetores vazando ou sujos.",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Leitura dos *Fuel Trims* (negativos altos) via scanner e teste de estanqueidade dos injetores.",
          "solucao": "Limpeza ou substituição dos injetores."
        },
        {
          "causa": "Filtro de ar obstruído ou sensor MAF/MAP com leitura incorreta.",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Inspeção visual do filtro de ar e leitura dos valores do MAF/MAP via Live Data.",
          "solucao": "Substituição do filtro de ar ou limpeza/substituição do sensor."
        }
      ]
    },
    {
      "id": 6,
      "sintoma": "Vibração no volante apenas em velocidades entre 80-100 km/h.",
      "categoria": "Suspensão",
      "possiveis_causas": [
        {
          "causa": "Desbalanceamento das rodas dianteiras.",
          "probabilidade": "Alta",
          "gravidade": "Baixa",
          "verificacao": "Inspeção visual de pesos de balanceamento e teste em máquina balanceadora.",
          "solucao": "Balanceamento das rodas."
        }
      ]
    },
    {
      "id": 7,
      "sintoma": "Vibração na carroceria inteira em alta velocidade (acima de 120 km/h).",
      "categoria": "Suspensão",
      "possiveis_causas": [
        {
          "causa": "Desbalanceamento das rodas traseiras ou pneus deformados.",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Inspeção visual dos pneus (bolhas, deformações) e balanceamento das rodas traseiras.",
          "solucao": "Balanceamento e/ou substituição dos pneus."
        },
        {
          "causa": "Cardã (eixo de transmissão) desbalanceado ou cruzetas com folga (veículos de tração traseira).",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Inspeção visual da fixação do cardã e teste de folga nas cruzetas.",
          "solucao": "Balanceamento do cardã ou substituição de cruzetas."
        }
      ]
    },
    {
      "id": 8,
      "sintoma": "Vibração no pedal do freio ao acionar o freio.",
      "categoria": "Freios",
      "possiveis_causas": [
        {
          "causa": "Discos de freio dianteiros empenados (ovalização).",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Medição do empenamento dos discos com relógio comparador.",
          "solucao": "Retífica ou substituição dos discos de freio."
        }
      ]
    },
    {
      "id": 9,
      "sintoma": "Barulho de 'rangido' ou 'chiado' ao frear.",
      "categoria": "Freios",
      "possiveis_causas": [
        {
          "causa": "Pastilhas de freio gastas (atingindo o indicador de desgaste).",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Inspeção visual da espessura das pastilhas.",
          "solucao": "Substituição das pastilhas e verificação dos discos."
        },
        {
          "causa": "Pastilhas de freio de má qualidade ou vitrificadas.",
          "probabilidade": "Média",
          "gravidade": "Baixa",
          "verificacao": "Inspeção visual da superfície de atrito da pastilha.",
          "solucao": "Substituição por pastilhas de qualidade superior."
        }
      ]
    },
    {
      "id": 10,
      "sintoma": "Pedal do freio 'mole' ou 'esponjoso', afunda mais que o normal.",
      "categoria": "Freios",
      "possiveis_causas": [
        {
          "causa": "Presença de ar no sistema hidráulico de freios.",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Verificação do nível do fluido e realização de sangria.",
          "solucao": "Sangria completa do sistema de freios."
        },
        {
          "causa": "Cilindro mestre com defeito (passagem interna de fluido).",
          "probabilidade": "Média",
          "gravidade": "Crítica",
          "verificacao": "Teste de estanqueidade do cilindro mestre.",
          "solucao": "Substituição do cilindro mestre."
        }
      ]
    },
    {
      "id": 11,
      "sintoma": "Barulho de 'batida seca' ao passar em buracos ou lombadas.",
      "categoria": "Suspensão",
      "possiveis_causas": [
        {
          "causa": "Amortecedor estourado ou com vazamento.",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Inspeção visual de vazamento de óleo no corpo do amortecedor e teste de balanço da carroceria.",
          "solucao": "Substituição do par de amortecedores."
        },
        {
          "causa": "Bieletas ou buchas da barra estabilizadora com folga.",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Inspeção visual e teste de alavanca (pé de cabra) nas bieletas.",
          "solucao": "Substituição das bieletas e/ou buchas."
        }
      ]
    },
    {
      "id": 12,
      "sintoma": "Vazamento de fluido verde/rosa/azul (anticongelante) sob o carro.",
      "categoria": "Arrefecimento",
      "possiveis_causas": [
        {
          "causa": "Furo no radiador ou mangueira do sistema de arrefecimento rachada.",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Teste de pressão do sistema de arrefecimento.",
          "solucao": "Reparo ou substituição do radiador/mangueira."
        },
        {
          "causa": "Selo da bomba d'água com vazamento.",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Inspeção visual da bomba d'água e rastreamento do vazamento.",
          "solucao": "Substituição da bomba d'água."
        }
      ]
    },
    {
      "id": 13,
      "sintoma": "Luz de alerta de óleo (vermelha) acesa no painel.",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Pressão de óleo insuficiente (nível baixo ou bomba de óleo com defeito).",
          "probabilidade": "Alta",
          "gravidade": "Crítica",
          "verificacao": "Verificar nível de óleo e medir a pressão de óleo com manômetro.",
          "solucao": "Completar nível ou substituir a bomba de óleo. **Parar o motor imediatamente.**"
        }
      ]
    },
    {
      "id": 14,
      "sintoma": "Luz de alerta de temperatura (vermelha) acesa no painel.",
      "categoria": "Arrefecimento",
      "possiveis_causas": [
        {
          "causa": "Superaquecimento do motor (falha na ventoinha, baixo nível de fluido).",
          "probabilidade": "Alta",
          "gravidade": "Crítica",
          "verificacao": "Medir a temperatura real do motor e inspecionar o funcionamento da ventoinha.",
          "solucao": "Diagnosticar e corrigir a causa do superaquecimento. **Parar o motor imediatamente.**"
        }
      ]
    },
    {
      "id": 15,
      "sintoma": "Luz de alerta da bateria (vermelha) acesa com o motor ligado.",
      "categoria": "Elétrica",
      "possiveis_causas": [
        {
          "causa": "Alternador não está carregando a bateria.",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Medir a tensão de carga (deve ser 13.8V a 14.5V) com o motor ligado.",
          "solucao": "Reparar ou substituir o alternador/regulador de tensão."
        },
        {
          "causa": "Correia do alternador rompida ou frouxa.",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Inspeção visual da correia Poly-V.",
          "solucao": "Tensionar ou substituir a correia."
        }
      ]
    },
    {
      "id": 16,
      "sintoma": "Luz 'Check Engine' (amarela) acesa de forma contínua.",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Falha no sistema de controle de emissões ou motor.",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Passar o scanner OBD2 para ler o Código de Falha de Diagnóstico (DTC).",
          "solucao": "Diagnosticar e corrigir a falha indicada pelo DTC (ex: Sonda Lambda, catalisador, falha de ignição)."
        }
      ]
    },
    {
      "id": 17,
      "sintoma": "Perda de potência perceptível, especialmente em subidas ou acelerações.",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Filtro de combustível obstruído ou bomba de combustível fraca.",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Medir a pressão e vazão da bomba de combustível com manômetro.",
          "solucao": "Substituir o filtro de combustível e/ou a bomba."
        },
        {
          "causa": "Catalisador entupido (alta contrapressão no escapamento).",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Teste de contrapressão do escapamento.",
          "solucao": "Substituição do catalisador."
        }
      ]
    },
    {
      "id": 18,
      "sintoma": "Consumo de combustível muito acima do normal.",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Sonda Lambda (sensor de oxigênio) com defeito ou lenta.",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Leitura da tensão e do ciclo de trabalho da Sonda Lambda via Live Data.",
          "solucao": "Substituição da Sonda Lambda."
        },
        {
          "causa": "Sensor de temperatura do motor (ECT) com leitura errada (indica motor frio).",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Comparar a temperatura lida pelo scanner com a temperatura real do motor.",
          "solucao": "Substituição do sensor ECT."
        }
      ]
    },
    {
      "id": 19,
      "sintoma": "Dificuldade para engatar marchas (câmbio manual).",
      "categoria": "Transmissão",
      "possiveis_causas": [
        {
          "causa": "Embreagem não está desengatando completamente (cilindro mestre/auxiliar com defeito ou ar no sistema).",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Verificar nível do fluido de embreagem e realizar sangria.",
          "solucao": "Sangria do sistema ou substituição de cilindros."
        },
        {
          "causa": "Baixo nível ou qualidade do óleo da caixa de câmbio.",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Inspeção do nível e cor do óleo do câmbio.",
          "solucao": "Troca do óleo do câmbio conforme especificação."
        }
      ]
    },
    {
      "id": 20,
      "sintoma": "Embreagem 'patinando' (motor acelera, mas o carro não ganha velocidade).",
      "categoria": "Transmissão",
      "possiveis_causas": [
        {
          "causa": "Disco de embreagem gasto ou contaminado por óleo.",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Inspeção visual da espessura do disco e estado do platô após remoção do câmbio.",
          "solucao": "Substituição do kit de embreagem (disco, platô e rolamento)."
        }
      ]
    },
    {
      "id": 21,
      "sintoma": "Vazamento de óleo marrom/preto, viscoso, na parte inferior do motor.",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Junta do cárter ou retentor do virabrequim (dianteiro ou traseiro) com vazamento.",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Limpeza da área e rastreamento da origem do vazamento (de cima para baixo).",
          "solucao": "Substituição da junta ou retentor."
        }
      ]
    },
    {
      "id": 22,
      "sintoma": "Barulho de 'grunhido' ou 'ronco' que aumenta com a velocidade do veículo.",
      "categoria": "Suspensão",
      "possiveis_causas": [
        {
          "causa": "Rolamento de roda danificado.",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Levantar o carro e girar a roda manualmente, ou ouvir o ruído em curva (o ruído diminui no lado do rolamento defeituoso).",
          "solucao": "Substituição do rolamento de roda."
        }
      ]
    },
    {
      "id": 23,
      "sintoma": "Volante 'puxando' para um lado durante a condução.",
      "categoria": "Suspensão",
      "possiveis_causas": [
        {
          "causa": "Desalinhamento da direção (geometria).",
          "probabilidade": "Alta",
          "gravidade": "Baixa",
          "verificacao": "Medição da geometria da suspensão.",
          "solucao": "Realizar alinhamento da direção."
        },
        {
          "causa": "Pneu com pressão incorreta ou desgaste irregular.",
          "probabilidade": "Média",
          "gravidade": "Baixa",
          "verificacao": "Medir a pressão dos pneus e inspecionar o desgaste.",
          "solucao": "Calibrar ou substituir o pneu."
        }
      ]
    },
    {
      "id": 24,
      "sintoma": "Motor 'batendo pino' (detonação) em acelerações fortes.",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Combustível de baixa octanagem ou adulterado.",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Análise do combustível (densidade) e verificação do ponto de ignição via scanner.",
          "solucao": "Drenar o tanque e abastecer com combustível de qualidade."
        },
        {
          "causa": "Velas de ignição com grau térmico incorreto ou carbonização excessiva.",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Inspeção visual das velas.",
          "solucao": "Substituição das velas pelo modelo correto."
        }
      ]
    },
    {
      "id": 25,
      "sintoma": "Carro falhando ou engasgando em aceleração.",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Velas, cabos ou bobinas de ignição com falha intermitente.",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Teste de centelha e inspeção visual dos componentes de ignição. Verificar DTCs P030X.",
          "solucao": "Substituição dos componentes de ignição defeituosos."
        },
        {
          "causa": "Filtro de combustível parcialmente obstruído.",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Medir a pressão de combustível em aceleração.",
          "solucao": "Substituição do filtro de combustível."
        }
      ]
    },
    {
      "id": 26,
      "sintoma": "Barulho de 'chiado' alto vindo do motor, que some ao acelerar.",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Correia Poly-V (acessórios) frouxa ou ressecada.",
          "probabilidade": "Alta",
          "gravidade": "Baixa",
          "verificacao": "Inspeção visual da tensão e estado da correia.",
          "solucao": "Tensionar ou substituir a correia."
        },
        {
          "causa": "Rolamento de algum acessório (alternador, compressor) gripado.",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Remover a correia e girar manualmente cada acessório.",
          "solucao": "Substituição do rolamento ou acessório."
        }
      ]
    },
    {
      "id": 27,
      "sintoma": "Vazamento de fluido vermelho/marrom claro, fino, na parte central do carro.",
      "categoria": "Transmissão",
      "possiveis_causas": [
        {
          "causa": "Vazamento de Óleo de Transmissão Automática (ATF).",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Verificar nível do fluido ATF e inspecionar juntas do cárter do câmbio ou mangueiras do radiador de óleo.",
          "solucao": "Substituição de juntas ou mangueiras. Completar nível."
        }
      ]
    },
    {
      "id": 28,
      "sintoma": "Barulho de 'estalo' ao esterçar o volante em manobras.",
      "categoria": "Suspensão",
      "possiveis_causas": [
        {
          "causa": "Junta homocinética da roda com folga ou coifa rompida.",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Inspeção visual da coifa e teste de folga na junta homocinética.",
          "solucao": "Substituição da junta homocinética."
        }
      ]
    },
    {
      "id": 29,
      "sintoma": "Motor demora a atingir a temperatura normal de trabalho (ponteiro baixo).",
      "categoria": "Arrefecimento",
      "possiveis_causas": [
        {
          "causa": "Válvula termostática travada na posição aberta.",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Verificar se a mangueira inferior do radiador aquece rapidamente após a partida (indica fluxo constante).",
          "solucao": "Substituição da válvula termostática."
        }
      ]
    },
    {
      "id": 30,
      "sintoma": "Odor de combustível dentro do veículo.",
      "categoria": "Outros",
      "possiveis_causas": [
        {
          "causa": "Vazamento na linha de combustível ou no anel de vedação da bomba sob o banco traseiro.",
          "probabilidade": "Alta",
          "gravidade": "Crítica",
          "verificacao": "Inspeção visual da linha de combustível e remoção do banco traseiro para verificar a tampa da bomba.",
          "solucao": "Reparo do vazamento e substituição de anéis/mangueiras."
        },
        {
          "causa": "Tampa do tanque de combustível mal fechada ou com vedação danificada (Sistema EVAP).",
          "probabilidade": "Média",
          "gravidade": "Baixa",
          "verificacao": "Inspeção visual da tampa e verificação de DTCs P044X.",
          "solucao": "Substituição da tampa do tanque."
        }
      ]
    },
    {
      "id": 31,
      "sintoma": "Faróis ou luzes internas piscando ou com brilho fraco.",
      "categoria": "Elétrica",
      "possiveis_causas": [
        {
          "causa": "Conexão de aterramento (negativo) solta ou oxidada.",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Inspeção visual e teste de continuidade/resistência nos pontos de aterramento.",
          "solucao": "Limpeza e reaperto dos pontos de aterramento."
        },
        {
          "causa": "Alternador com falha intermitente (tensão de carga instável).",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Monitorar a tensão de carga com o motor ligado e acessórios acionados.",
          "solucao": "Reparo ou substituição do alternador."
        }
      ]
    },
    {
      "id": 32,
      "sintoma": "Direção hidráulica/elétrica 'dura' ou pesada.",
      "categoria": "Suspensão",
      "possiveis_causas": [
        {
          "causa": "Baixo nível de fluido da direção hidráulica ou bomba com defeito.",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Verificar nível do fluido e inspecionar a bomba e mangueiras.",
          "solucao": "Completar fluido e/ou substituir a bomba."
        },
        {
          "causa": "Falha no motor elétrico ou sensor de torque (direção elétrica - EPS).",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Leitura de DTCs específicos do módulo da direção elétrica.",
          "solucao": "Reparo ou substituição da coluna/caixa de direção elétrica."
        }
      ]
    },
    {
      "id": 33,
      "sintoma": "Barulho de 'cloc-cloc' ao arrancar ou mudar de marcha (câmbio automático).",
      "categoria": "Transmissão",
      "possiveis_causas": [
        {
          "causa": "Coxins do motor ou câmbio rompidos ou desgastados.",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Inspeção visual dos coxins e teste de movimento do motor/câmbio com o freio de mão acionado.",
          "solucao": "Substituição dos coxins danificados."
        }
      ]
    },
    {
      "id": 34,
      "sintoma": "Carro 'pula' ou 'quica' excessivamente em estradas irregulares.",
      "categoria": "Suspensão",
      "possiveis_causas": [
        {
          "causa": "Amortecedores sem ação (esgotados).",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Teste de balanço da carroceria (não deve oscilar mais de uma vez).",
          "solucao": "Substituição do par de amortecedores."
        }
      ]
    },
    {
      "id": 35,
      "sintoma": "Luz do ABS (amarela) acesa no painel.",
      "categoria": "Freios",
      "possiveis_causas": [
        {
          "causa": "Sensor de velocidade da roda (ABS) sujo ou com defeito.",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Leitura de DTCs específicos do módulo ABS e inspeção visual dos sensores e rodas fônicas.",
          "solucao": "Limpeza ou substituição do sensor ABS."
        }
      ]
    },
    {
      "id": 36,
      "sintoma": "Motor de arranque gira, mas o motor não pega (não há ignição).",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Falha de ignição (sem centelha) ou falha de injeção (sem combustível).",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Testar a presença de centelha nas velas e medir a pressão de combustível.",
          "solucao": "Diagnosticar e corrigir o sistema de ignição (bobina, sensor CKP) ou de alimentação (bomba, injetores)."
        },
        {
          "causa": "Correia dentada rompida ou fora de ponto.",
          "probabilidade": "Média",
          "gravidade": "Crítica",
          "verificacao": "Inspeção visual da correia e teste de compressão (compressão zero indica correia rompida).",
          "solucao": "Substituição da correia e verificação de danos internos no motor."
        }
      ]
    },
    {
      "id": 37,
      "sintoma": "Vazamento de fluido incolor com odor forte (combustível) sob o carro.",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Mangueira da linha de combustível rachada ou conexão solta.",
          "probabilidade": "Alta",
          "gravidade": "Crítica",
          "verificacao": "Inspeção visual da linha de combustível, do tanque ao motor.",
          "solucao": "Substituição da mangueira ou reaperto da conexão. **Risco de incêndio.**"
        }
      ]
    },
    {
      "id": 38,
      "sintoma": "Marchas 'patinando' ou trocas bruscas (câmbio automático).",
      "categoria": "Transmissão",
      "possiveis_causas": [
        {
          "causa": "Baixo nível ou fluido de transmissão (ATF) contaminado/vencido.",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Verificar nível e condição do ATF (cor e odor).",
          "solucao": "Troca do fluido e filtro da transmissão."
        },
        {
          "causa": "Falha nas solenoides de troca de marcha (corpo de válvulas).",
          "probabilidade": "Média",
          "gravidade": "Alta",
          "verificacao": "Leitura de DTCs específicos do TCM (Módulo de Controle da Transmissão).",
          "solucao": "Substituição das solenoides ou reparo do corpo de válvulas."
        }
      ]
    },
    {
      "id": 39,
      "sintoma": "Barulho de 'assobio' ou 'sopro' vindo do motor (turbo).",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Vazamento de pressão no sistema de turbo (mangueiras do intercooler soltas ou rachadas).",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Inspeção visual das mangueiras e teste de pressão do sistema de admissão.",
          "solucao": "Reaperto ou substituição das mangueiras."
        },
        {
          "causa": "Rotor da turbina danificado ou com folga excessiva.",
          "probabilidade": "Média",
          "gravidade": "Crítica",
          "verificacao": "Inspeção visual da turbina e teste de folga axial/radial.",
          "solucao": "Reparo ou substituição da turbina."
        }
      ]
    },
    {
      "id": 40,
      "sintoma": "Pedal do freio 'duro' ou exige muita força para frear.",
      "categoria": "Freios",
      "possiveis_causas": [
        {
          "causa": "Falha no servo-freio (hidrovácuo) ou mangueira de vácuo rompida/obstruída.",
          "probabilidade": "Alta",
          "gravidade": "Alta",
          "verificacao": "Teste de vácuo no servo-freio e inspeção da mangueira de vácuo.",
          "solucao": "Substituição da mangueira ou do servo-freio."
        }
      ]
    },
    {
      "id": 41,
      "sintoma": "Luz de alerta do Airbag (vermelha) acesa.",
      "categoria": "Elétrica",
      "possiveis_causas": [
        {
          "causa": "Falha no *Hard Disk* (cinta do airbag) no volante.",
          "probabilidade": "Alta",
          "gravidade": "Média",
          "verificacao": "Leitura de DTCs específicos do módulo SRS (Airbag).",
          "solucao": "Substituição da cinta do airbag."
        },
        {
          "causa": "Conector do airbag sob o banco solto ou oxidado.",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Inspeção visual dos conectores sob os bancos.",
          "solucao": "Limpeza e reaperto dos conectores."
        }
      ]
    },
    {
      "id": 42,
      "sintoma": "Carro 'engasga' ou 'cabeceia' ao usar etanol (álcool).",
      "categoria": "Motor",
      "possiveis_causas": [
        {
          "causa": "Velas de ignição gastas (etanol exige mais da ignição).",
          "probabilidade": "Alta",
          "gravidade": "Baixa",
          "verificacao": "Inspeção visual das velas e teste de centelha.",
          "solucao": "Substituição das velas."
        },
        {
          "causa": "Sensor de oxigênio (Sonda Lambda) lento para compensar a mistura.",
          "probabilidade": "Média",
          "gravidade": "Média",
          "verificacao": "Monitorar a velocidade de resposta da Sonda Lambda via Live Data.",
          "solucao": "Substituição da Sonda Lambda."
        }
      ]
    }
  ]
}
