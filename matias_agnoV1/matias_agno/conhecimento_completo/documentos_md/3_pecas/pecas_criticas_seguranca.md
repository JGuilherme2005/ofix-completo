{
  "pecas_criticas": [
    {
      "categoria": "Freios",
      "peca": "Pastilhas de Freio Dianteiras (com sensor)",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar pastilha sem sensor em veículo que exige sensor, desativando o alerta de desgaste.",
        "Usar pastilha de composto inadequado (muito macio ou muito duro) para o disco, comprometendo a frenagem."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Número do chassi (VIN) para verificar o sistema de freio original (Ex: ATE, Bosch, Teves).", "Código da peça original."],
        "medicoes": ["Espessura da pastilha e da chapa de apoio."],
        "visual": ["Formato exato da pastilha e posição do sensor de desgaste."],
        "vin_decoding": "Sim, o VIN é crucial para identificar o sistema de freio instalado de fábrica."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica (vendida em jogo)",
        "eixo": "Dianteiro",
        "com_sensor": "Sim",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Composto (cerâmico, semi-metálico) e sistema de freio (Ex: Bosch, ATE)."
      },
      "original_vs_paralela": {
        "recomendacao": "Original preferível",
        "marcas_confiaveis_paralelas": ["Fras-le", "Cobreq", "TRW", "Bosch"],
        "marcas_evitar": ["Marcas desconhecidas com preço muito abaixo do mercado."],
        "risco_uso_inferior": "Perda de eficiência de frenagem, ruído excessivo, desgaste prematuro do disco e falha no sensor de alerta."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Veículos médios e premium (Ex: VW Jetta, GM Cruze, Ford Focus)"],
        "anos": "2010-Atual",
        "incompatibilidades_perigosas": ["Pastilhas de veículos com freio a tambor traseiro não servem em veículos com disco traseiro, mesmo que o modelo seja o mesmo."],
        "adaptacoes_proibidas": ["Lixar a pastilha para encaixar, cortar o fio do sensor."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Ferramenta para recolher o pistão da pinça (especialmente em freio de estacionamento eletrônico)."],
        "calibracao_necessaria": "Sim, em veículos com freio de estacionamento eletrônico (EPB), é necessário usar o scanner para recolher o pistão.",
        "torque_critico": "Parafusos da pinça (geralmente entre 80Nm e 120Nm)."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Ausência de defeitos de fabricação, ruído excessivo (se não for característica do composto) e desgaste prematuro.",
        "condicoes_perda_garantia": ["Uso de fluido de freio incorreto, instalação incorreta, uso em condições extremas (pista)."]
      },
      "checklist_entrega": [
        "Verificar o nível e a cor do fluido de freio.",
        "Conferir o torque dos parafusos da roda.",
        "Realizar o assentamento das pastilhas (procedimento de frenagem suave)."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Discos de Freio Ventilados Dianteiros",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar disco sólido no lugar de ventilado (superaquecimento e falha de frenagem).",
        "Não medir a espessura mínima do disco antes da instalação de pastilhas novas."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Diâmetro externo (mm)", "Espessura total (mm)", "Número de furos de fixação."],
        "medicoes": ["Espessura mínima (limite de descarte) e espessura atual."],
        "visual": ["Tipo de ventilação (reta, curva) e se é sólido ou ventilado."],
        "vin_decoding": "Sim, para identificar o diâmetro correto."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica (vendido em par)",
        "eixo": "Dianteiro",
        "com_sensor": "Não se aplica",
        "diametro": "Varia de 236mm a 340mm",
        "furos": "4, 5 ou 6 furos",
        "outras": "Com ou sem cubo integrado."
      },
      "original_vs_paralela": {
        "recomendacao": "Original preferível",
        "marcas_confiaveis_paralelas": ["Fremax", "Hipper Freios", "TRW", "Varga"],
        "marcas_evitar": ["Discos sem certificação INMETRO."],
        "risco_uso_inferior": "Empenamento (vibração no pedal), trincas e falha total de frenagem por superaquecimento."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Ampla gama de veículos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Discos de 4 furos não servem em 5 furos. Discos de diâmetro diferente do original não cabem na pinça."],
        "adaptacoes_proibidas": ["Usar calços ou adaptadores para mudar o diâmetro ou furação."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Micrômetro para medir a espessura e o empenamento lateral."],
        "calibracao_necessaria": "Não se aplica",
        "torque_critico": "Parafusos da pinça e da roda (crucial para evitar empenamento)."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Ausência de defeitos de fabricação e empenamento prematuro (se instalado corretamente).",
        "condicoes_perda_garantia": ["Uso de pastilhas inadequadas, instalação sem limpeza do cubo, aperto incorreto das rodas."]
      },
      "checklist_entrega": [
        "Limpar o cubo da roda antes de instalar o disco.",
        "Verificar o empenamento lateral após a instalação (máximo 0,05mm).",
        "Apertar as rodas com torquímetro no padrão estrela."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Cilindro Mestre",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Não fazer a sangria correta, deixando ar no sistema (pedal baixo e ineficiente).",
        "Instalar cilindro de diâmetro diferente do original (muda a pressão e o curso do pedal)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Diâmetro interno do cilindro (mm).", "Tipo de freio (disco/tambor, ABS/sem ABS)."],
        "medicoes": ["Diâmetro interno."],
        "visual": ["Número de saídas de fluido e tipo de reservatório."],
        "vin_decoding": "Sim, para o diâmetro e sistema de freio."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Não se aplica",
        "com_sensor": "Sim, sensor de nível de fluido.",
        "diametro": "Varia de 19mm a 25mm",
        "furos": "Não se aplica",
        "outras": "Com ou sem válvula equalizadora integrada."
      },
      "original_vs_paralela": {
        "recomendacao": "Sempre original",
        "marcas_confiaveis_paralelas": ["ATE", "TRW", "Bosch"],
        "marcas_evitar": ["Cilindros recondicionados de procedência duvidosa."],
        "risco_uso_inferior": "Falha total do sistema de freio, vazamento interno (pedal afunda lentamente)."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Diâmetro diferente do original."],
        "adaptacoes_proibidas": ["Reaproveitar o reservatório se estiver sujo ou trincado."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Sangrador de freio a vácuo ou pressurizado."],
        "calibracao_necessaria": "Sim, sangria completa do sistema e, em alguns casos, calibração do sensor de pressão.",
        "torque_critico": "Parafusos de fixação no servo-freio."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Vedação perfeita e funcionamento hidráulico.",
        "condicoes_perda_garantia": ["Uso de fluido de freio contaminado ou incorreto."]
      },
      "checklist_entrega": [
        "Fazer a pré-sangria do cilindro mestre antes da instalação.",
        "Sangria completa das 4 rodas (começando pela mais distante).",
        "Teste de pedal (firmeza e curso)."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Fluido de Freio",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Usar DOT 3 em sistema que exige DOT 4 ou 5.1 (ponto de ebulição baixo e falha por 'vapor lock').",
        "Misturar fluidos de bases diferentes (Ex: DOT 4 com DOT 5 - base silicone)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Especificação exigida pelo fabricante (DOT 3, 4, 5.1)."],
        "medicoes": ["Teste de ponto de ebulição (com medidor específico)."],
        "visual": ["Cor (não é um indicador confiável, mas o fluido novo é claro)."],
        "vin_decoding": "Não se aplica"
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Não se aplica",
        "com_sensor": "Não se aplica",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Ponto de ebulição seco e úmido."
      },
      "original_vs_paralela": {
        "recomendacao": "Paralela de qualidade OK",
        "marcas_confiaveis_paralelas": ["ATE", "Bosch", "Varga", "Motul"],
        "marcas_evitar": ["Fluidos sem selo INMETRO."],
        "risco_uso_inferior": "Vapor lock (perda total de freio por fervura do fluido)."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Misturar DOT 3/4/5.1 (base glicol) com DOT 5 (base silicone)."],
        "adaptacoes_proibidas": ["Completar o nível com água ou fluido de direção hidráulica."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Medidor de ponto de ebulição."],
        "calibracao_necessaria": "Não se aplica",
        "torque_critico": "Não se aplica"
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Qualidade e pureza do fluido.",
        "condicoes_perda_garantia": ["Contaminação por água ou outros fluidos."]
      },
      "checklist_entrega": [
        "Verificar a especificação correta (DOT) no reservatório.",
        "Trocar o fluido a cada 1 ou 2 anos (independente da quilometragem)."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Flexíveis de Freio",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Reaproveitar flexíveis velhos em sistemas novos (risco de rompimento por fadiga).",
        "Instalar flexível com comprimento incorreto (pode esticar ou dobrar em manobras)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Comprimento total (mm)", "Tipo de rosca e conexão."],
        "medicoes": ["Comprimento."],
        "visual": ["Sinais de rachaduras, inchaço ou vazamento."],
        "vin_decoding": "Sim, para o comprimento e tipo de conexão."
      },
      "especificacoes_variaveis": {
        "lado": "Dianteiro Esquerdo/Direito",
        "eixo": "Dianteiro/Traseiro",
        "com_sensor": "Não se aplica",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Material (borracha ou malha de aço - Aeroquip)."
      },
      "original_vs_paralela": {
        "recomendacao": "Original preferível",
        "marcas_confiaveis_paralelas": ["ContiTech", "TRW", "Bosch"],
        "marcas_evitar": ["Flexíveis sem marca aparente."],
        "risco_uso_inferior": "Rompimento súbito e perda total de freio."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Flexível de comprimento diferente do original."],
        "adaptacoes_proibidas": ["Emendar ou reparar flexíveis rompidos."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Chave de boca para tubos (para evitar espanar a porca)."],
        "calibracao_necessaria": "Sim, sangria completa após a troca.",
        "torque_critico": "Porcas de fixação nas tubulações (aperto correto para vedação)."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Vedação e resistência à pressão.",
        "condicoes_perda_garantia": ["Instalação incorreta (torção ou estiramento)."]
      },
      "checklist_entrega": [
        "Verificar se o flexível não está torcido ou raspando em outras peças.",
        "Sangria completa do sistema."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Sensor ABS",
      "importancia_seguranca": "Alta",
      "erros_comuns": [
        "Instalar sensor de modelo diferente (pode gerar leitura incorreta e falha do ABS).",
        "Dano ao cabo durante a instalação (curto-circuito ou interrupção do sinal)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Localização (roda/eixo)", "Tipo de sensor (ativo/passivo)."],
        "medicoes": ["Resistência (para sensores passivos) e sinal (com osciloscópio para ativos)."],
        "visual": ["Tipo de conector e comprimento do cabo."],
        "vin_decoding": "Sim, para o tipo de sistema ABS."
      },
      "especificacoes_variaveis": {
        "lado": "Dianteiro Esquerdo/Direito, Traseiro Esquerdo/Direito",
        "eixo": "Dianteiro/Traseiro",
        "com_sensor": "Sim",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Número de pinos no conector."
      },
      "original_vs_paralela": {
        "recomendacao": "Original preferível",
        "marcas_confiaveis_paralelas": ["Bosch", "Continental", "Delphi"],
        "marcas_evitar": ["Sensores genéricos sem marca."],
        "risco_uso_inferior": "Luz do ABS acesa, falha do sistema ABS/ESP, frenagem instável."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos com ABS"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Sensor passivo no lugar de ativo e vice-versa."],
        "adaptacoes_proibidas": ["Emendar o cabo do sensor."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Scanner para apagar o código de falha e verificar o sinal ao vivo."],
        "calibracao_necessaria": "Sim, verificação do sinal com o veículo em movimento.",
        "torque_critico": "Parafuso de fixação do sensor."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Leitura correta do sinal.",
        "condicoes_perda_garantia": ["Dano físico ao sensor ou cabo durante a instalação."]
      },
      "checklist_entrega": [
        "Verificar a limpeza da roda fônica (anel magnético).",
        "Passar o cabo do sensor nos pontos de fixação originais.",
        "Apagar o código de falha e testar o sistema."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Servo-Freio (Hidrovácuo)",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar servo-freio com diâmetro ou estágio (simples/duplo) diferente do original (muda a assistência e o curso do pedal).",
        "Vazamento de vácuo por instalação incorreta da mangueira."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Diâmetro do corpo (polegadas)", "Estágios (simples ou duplo)."],
        "medicoes": ["Diâmetro."],
        "visual": ["Número de estágios e tipo de conexão com o cilindro mestre."],
        "vin_decoding": "Sim, para o diâmetro e estágio."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Não se aplica",
        "com_sensor": "Não se aplica",
        "diametro": "Varia de 7 a 11 polegadas",
        "furos": "Não se aplica",
        "outras": "Com ou sem haste ajustável."
      },
      "original_vs_paralela": {
        "recomendacao": "Sempre original",
        "marcas_confiaveis_paralelas": ["TRW", "Bosch", "ContiTech"],
        "marcas_evitar": ["Peças recondicionadas sem garantia de fábrica."],
        "risco_uso_inferior": "Perda de assistência de freio (pedal duro) ou assistência excessiva (freio muito sensível)."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Servo-freio simples no lugar de duplo."],
        "adaptacoes_proibidas": ["Ajustar a haste de acionamento sem o gabarito correto."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Não se aplica"],
        "calibracao_necessaria": "Sim, ajuste da haste de acionamento (se aplicável).",
        "torque_critico": "Porcas de fixação no painel corta-fogo."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Vedação e assistência de vácuo.",
        "condicoes_perda_garantia": ["Instalação incorreta do cilindro mestre ou da mangueira de vácuo."]
      },
      "checklist_entrega": [
        "Teste de estanqueidade do vácuo (pedal deve ficar duro após 3 bombadas com o motor desligado).",
        "Verificar o torque das porcas de fixação."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Lonas e Sapatas de Freio Traseiras",
      "importancia_seguranca": "Alta",
      "erros_comuns": [
        "Não trocar o cilindro de roda junto com as lonas (risco de vazamento).",
        "Não fazer a regulagem correta do freio de estacionamento."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Diâmetro do tambor (mm)", "Largura da lona (mm)."],
        "medicoes": ["Diâmetro interno do tambor (para verificar se precisa de retífica)."],
        "visual": ["Formato da sapata e tipo de mola."],
        "vin_decoding": "Sim, para o diâmetro do tambor."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica (vendida em jogo)",
        "eixo": "Traseiro",
        "com_sensor": "Não se aplica",
        "diametro": "Varia de 180mm a 250mm",
        "furos": "Não se aplica",
        "outras": "Com ou sem alavanca de freio de mão integrada."
      },
      "original_vs_paralela": {
        "recomendacao": "Paralela de qualidade OK",
        "marcas_confiaveis_paralelas": ["Fras-le", "Cobreq", "Bosch", "TRW"],
        "marcas_evitar": ["Lonas com rebitagem mal feita."],
        "risco_uso_inferior": "Frenagem ineficiente, ruído e travamento da roda."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Veículos populares"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Lona de diâmetro diferente do tambor."],
        "adaptacoes_proibidas": ["Reaproveitar molas e reguladores enferrujados."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Ferramenta para instalação de molas."],
        "calibracao_necessaria": "Sim, regulagem da folga da lona e do freio de estacionamento.",
        "torque_critico": "Porca do eixo (se aplicável)."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Eficiência de frenagem e ausência de ruído.",
        "condicoes_perda_garantia": ["Tambor ovalizado ou retificado incorretamente."]
      },
      "checklist_entrega": [
        "Verificar o estado do tambor (retífica ou troca).",
        "Lubrificar os pontos de contato da sapata com o espelho.",
        "Regulagem do freio de estacionamento."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Cilindro de Roda",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Não trocar o cilindro de roda junto com as lonas (risco de vazamento).",
        "Instalar cilindro de diâmetro diferente do original (muda a pressão e o curso do pedal)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Diâmetro interno do cilindro (mm).", "Tipo de freio (disco/tambor, ABS/sem ABS)."],
        "medicoes": ["Diâmetro interno."],
        "visual": ["Número de saídas de fluido e tipo de reservatório."],
        "vin_decoding": "Sim, para o diâmetro e sistema de freio."
      },
      "especificacoes_variaveis": {
        "lado": "Traseiro Esquerdo/Direito",
        "eixo": "Traseiro",
        "com_sensor": "Não se aplica",
        "diametro": "Varia de 19mm a 25mm",
        "furos": "Não se aplica",
        "outras": "Com ou sem válvula equalizadora integrada."
      },
      "original_vs_paralela": {
        "recomendacao": "Sempre original",
        "marcas_confiaveis_paralelas": ["ATE", "TRW", "Bosch"],
        "marcas_evitar": ["Cilindros recondicionados de procedência duvidosa."],
        "risco_uso_inferior": "Falha total do sistema de freio, vazamento interno (pedal afunda lentamente)."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Diâmetro diferente do original."],
        "adaptacoes_proibidas": ["Reaproveitar o reservatório se estiver sujo ou trincado."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Sangrador de freio a vácuo ou pressurizado."],
        "calibracao_necessaria": "Sim, sangria completa do sistema e, em alguns casos, calibração do sensor de pressão.",
        "torque_critico": "Parafusos de fixação no espelho."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Vedação perfeita e funcionamento hidráulico.",
        "condicoes_perda_garantia": ["Uso de fluido de freio contaminado ou incorreto."]
      },
      "checklist_entrega": [
        "Fazer a pré-sangria do cilindro mestre antes da instalação.",
        "Sangria completa das 4 rodas (começando pela mais distante).",
        "Teste de pedal (firmeza e curso)."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Módulo Hidráulico ABS",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar módulo sem a codificação correta (pode gerar falha no sistema de estabilidade - ESP).",
        "Não fazer a sangria do módulo (necessário scanner em alguns modelos)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Código da peça original (crucial).", "Número de válvulas e pinos."],
        "medicoes": ["Não se aplica"],
        "visual": ["Tipo de conector e número de tubulações."],
        "vin_decoding": "Sim, para o código exato do módulo."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Não se aplica",
        "com_sensor": "Sim",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Com ou sem ESP/ASR."
      },
      "original_vs_paralela": {
        "recomendacao": "Sempre original",
        "marcas_confiaveis_paralelas": ["Bosch", "Continental", "TRW"],
        "marcas_evitar": ["Módulos usados sem garantia de procedência."],
        "risco_uso_inferior": "Falha total do ABS/ESP, perda de controle do veículo em frenagens de emergência."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos com ABS"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Módulo de carro sem ESP em carro com ESP."],
        "adaptacoes_proibidas": ["Tentar reparar a placa eletrônica sem o equipamento adequado."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Scanner para codificação e sangria do módulo."],
        "calibracao_necessaria": "Sim, codificação e sangria eletrônica.",
        "torque_critico": "Porcas de fixação das tubulações (aperto correto para vedação)."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento eletrônico e hidráulico.",
        "condicoes_perda_garantia": ["Uso de fluido de freio incorreto ou contaminação."]
      },
      "checklist_entrega": [
        "Fazer a sangria eletrônica do módulo com o scanner.",
        "Apagar códigos de falha e testar o sistema em movimento."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Pastilhas de Freio Traseiras",
      "importancia_seguranca": "Alta",
      "erros_comuns": [
        "Não recolher o pistão corretamente (pode danificar o mecanismo do freio de estacionamento).",
        "Usar pastilha de composto inadequado."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Número do chassi (VIN) para verificar o sistema de freio original.", "Código da peça original."],
        "medicoes": ["Espessura da pastilha e da chapa de apoio."],
        "visual": ["Formato exato da pastilha e tipo de encaixe."],
        "vin_decoding": "Sim, para identificar o sistema de freio."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica (vendida em jogo)",
        "eixo": "Traseiro",
        "com_sensor": "Sim/Não",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Composto (cerâmico, semi-metálico) e sistema de freio (Ex: Bosch, ATE)."
      },
      "original_vs_paralela": {
        "recomendacao": "Original preferível",
        "marcas_confiaveis_paralelas": ["Fras-le", "Cobreq", "TRW", "Bosch"],
        "marcas_evitar": ["Marcas desconhecidas com preço muito abaixo do mercado."],
        "risco_uso_inferior": "Perda de eficiência de frenagem, ruído excessivo, desgaste prematuro do disco e falha no freio de estacionamento."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Veículos com disco traseiro"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Pastilhas de veículos com freio a tambor traseiro não servem em veículos com disco traseiro."],
        "adaptacoes_proibidas": ["Lixar a pastilha para encaixar, cortar o fio do sensor."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Ferramenta para recolher o pistão da pinça (girar e pressionar)."],
        "calibracao_necessaria": "Sim, em veículos com freio de estacionamento eletrônico (EPB), é necessário usar o scanner para recolher o pistão.",
        "torque_critico": "Parafusos da pinça (geralmente entre 80Nm e 120Nm)."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Ausência de defeitos de fabricação, ruído excessivo (se não for característica do composto) e desgaste prematuro.",
        "condicoes_perda_garantia": ["Uso de fluido de freio incorreto, instalação incorreta, uso em condições extremas (pista)."]
      },
      "checklist_entrega": [
        "Verificar o nível e a cor do fluido de freio.",
        "Conferir o torque dos parafusos da roda.",
        "Realizar o assentamento das pastilhas (procedimento de frenagem suave)."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Discos de Freio Sólidos Traseiros",
      "importancia_seguranca": "Alta",
      "erros_comuns": [
        "Não medir a espessura mínima do disco antes da instalação de pastilhas novas.",
        "Instalar disco de diâmetro diferente do original."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Diâmetro externo (mm)", "Espessura total (mm)", "Número de furos de fixação."],
        "medicoes": ["Espessura mínima (limite de descarte) e espessura atual."],
        "visual": ["Se é sólido ou ventilado (deve ser sólido)."],
        "vin_decoding": "Sim, para identificar o diâmetro correto."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica (vendido em par)",
        "eixo": "Traseiro",
        "com_sensor": "Não se aplica",
        "diametro": "Varia de 236mm a 300mm",
        "furos": "4 ou 5 furos",
        "outras": "Com ou sem cubo integrado."
      },
      "original_vs_paralela": {
        "recomendacao": "Original preferível",
        "marcas_confiaveis_paralelas": ["Fremax", "Hipper Freios", "TRW", "Varga"],
        "marcas_evitar": ["Discos sem certificação INMETRO."],
        "risco_uso_inferior": "Empenamento (vibração no pedal), trincas e falha total de frenagem por superaquecimento."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Ampla gama de veículos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Discos de 4 furos não servem em 5 furos. Discos de diâmetro diferente do original não cabem na pinça."],
        "adaptacoes_proibidas": ["Usar calços ou adaptadores para mudar o diâmetro ou furação."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Micrômetro para medir a espessura e o empenamento lateral."],
        "calibracao_necessaria": "Não se aplica",
        "torque_critico": "Parafusos da pinça e da roda (crucial para evitar empenamento)."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Ausência de defeitos de fabricação e empenamento prematuro (se instalado corretamente).",
        "condicoes_perda_garantia": ["Uso de pastilhas inadequadas, instalação sem limpeza do cubo, aperto incorreto das rodas."]
      },
      "checklist_entrega": [
        "Limpar o cubo da roda antes de instalar o disco.",
        "Verificar o empenamento lateral após a instalação (máximo 0,05mm).",
        "Apertar as rodas com torquímetro no padrão estrela."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Cabo de Freio de Mão",
      "importancia_seguranca": "Alta",
      "erros_comuns": [
        "Instalar cabo de comprimento incorreto (pode ficar frouxo ou esticado demais).",
        "Não lubrificar o cabo antes da instalação."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Comprimento total (mm)", "Tipo de terminal."],
        "medicoes": ["Comprimento."],
        "visual": ["Tipo de terminal e capa protetora."],
        "vin_decoding": "Sim, para o comprimento e tipo de terminal."
      },
      "especificacoes_variaveis": {
        "lado": "Esquerdo/Direito (se for bipartido)",
        "eixo": "Traseiro",
        "com_sensor": "Não se aplica",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Com ou sem regulador integrado."
      },
      "original_vs_paralela": {
        "recomendacao": "Paralela de qualidade OK",
        "marcas_confiaveis_paralelas": ["Fania", "Efrari", "Cobra"],
        "marcas_evitar": ["Cabos com capa protetora de baixa qualidade."],
        "risco_uso_inferior": "Rompimento do cabo, freio de mão ineficiente."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Cabo de comprimento diferente do original."],
        "adaptacoes_proibidas": ["Emendar ou reparar cabos rompidos."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Não se aplica"],
        "calibracao_necessaria": "Sim, regulagem da tensão do cabo.",
        "torque_critico": "Não se aplica"
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento e resistência à tração.",
        "condicoes_perda_garantia": ["Instalação incorreta (torção ou estiramento)."]
      },
      "checklist_entrega": [
        "Lubrificar o cabo antes da instalação.",
        "Regulagem do freio de mão (geralmente 3 a 5 cliques)."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Reguladores Automáticos de Freio",
      "importancia_seguranca": "Alta",
      "erros_comuns": [
        "Não trocar o regulador junto com as lonas (pode travar ou não regular o freio).",
        "Instalar o regulador invertido (não faz a regulagem automática)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Lado (direito/esquerdo)", "Tipo de freio (tambor/disco com freio de mão no cubo)."],
        "medicoes": ["Não se aplica"],
        "visual": ["Formato e sentido da rosca."],
        "vin_decoding": "Sim, para o tipo de sistema de freio."
      },
      "especificacoes_variaveis": {
        "lado": "Esquerdo/Direito",
        "eixo": "Traseiro",
        "com_sensor": "Não se aplica",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Com ou sem mola integrada."
      },
      "original_vs_paralela": {
        "recomendacao": "Paralela de qualidade OK",
        "marcas_confiaveis_paralelas": ["TRW", "Bosch", "ContiTech"],
        "marcas_evitar": ["Reguladores de plástico de baixa qualidade."],
        "risco_uso_inferior": "Freio desregulado, pedal baixo, freio de mão ineficiente."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Veículos com freio a tambor"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Regulador do lado esquerdo no direito."],
        "adaptacoes_proibidas": ["Reaproveitar reguladores enferrujados."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Não se aplica"],
        "calibracao_necessaria": "Sim, regulagem inicial da folga da lona.",
        "torque_critico": "Não se aplica"
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento automático.",
        "condicoes_perda_garantia": ["Instalação incorreta ou uso de lonas inadequadas."]
      },
      "checklist_entrega": [
        "Verificar o funcionamento do regulador (deve expandir a lona).",
        "Regulagem inicial da folga."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Pastilhas Freio de Mão (Pinça Traseira)",
      "importancia_seguranca": "Alta",
      "erros_comuns": [
        "Não recolher o pistão corretamente (pode danificar o mecanismo do freio de estacionamento).",
        "Usar pastilha de composto inadequado."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Número do chassi (VIN) para verificar o sistema de freio original.", "Código da peça original."],
        "medicoes": ["Espessura da pastilha e da chapa de apoio."],
        "visual": ["Formato exato da pastilha e tipo de encaixe."],
        "vin_decoding": "Sim, para identificar o sistema de freio."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica (vendida em jogo)",
        "eixo": "Traseiro",
        "com_sensor": "Sim/Não",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Composto (cerâmico, semi-metálico) e sistema de freio (Ex: Bosch, ATE)."
      },
      "original_vs_paralela": {
        "recomendacao": "Original preferível",
        "marcas_confiaveis_paralelas": ["Fras-le", "Cobreq", "TRW", "Bosch"],
        "marcas_evitar": ["Marcas desconhecidas com preço muito abaixo do mercado."],
        "risco_uso_inferior": "Perda de eficiência de frenagem, ruído excessivo, desgaste prematuro do disco e falha no freio de estacionamento."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Veículos com disco traseiro"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Pastilhas de veículos com freio a tambor traseiro não servem em veículos com disco traseiro."],
        "adaptacoes_proibidas": ["Lixar a pastilha para encaixar, cortar o fio do sensor."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Ferramenta para recolher o pistão da pinça (girar e pressionar)."],
        "calibracao_necessaria": "Sim, em veículos com freio de estacionamento eletrônico (EPB), é necessário usar o scanner para recolher o pistão.",
        "torque_critico": "Parafusos da pinça (geralmente entre 80Nm e 120Nm)."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Ausência de defeitos de fabricação, ruído excessivo (se não for característica do composto) e desgaste prematuro.",
        "condicoes_perda_garantia": ["Uso de fluido de freio incorreto, instalação incorreta, uso em condições extremas (pista)."]
      },
      "checklist_entrega": [
        "Verificar o nível e a cor do fluido de freio.",
        "Conferir o torque dos parafusos da roda.",
        "Realizar o assentamento das pastilhas (procedimento de frenagem suave)."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Pastilhas de Freio Dianteiras (sem sensor)",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar pastilha de composto inadequado (muito macio ou muito duro) para o disco, comprometendo a frenagem."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Número do chassi (VIN) para verificar o sistema de freio original (Ex: ATE, Bosch, Teves).", "Código da peça original."],
        "medicoes": ["Espessura da pastilha e da chapa de apoio."],
        "visual": ["Formato exato da pastilha e posição do sensor de desgaste."],
        "vin_decoding": "Sim, o VIN é crucial para identificar o sistema de freio instalado de fábrica."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica (vendida em jogo)",
        "eixo": "Dianteiro",
        "com_sensor": "Não",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Composto (cerâmico, semi-metálico) e sistema de freio (Ex: Bosch, ATE)."
      },
      "original_vs_paralela": {
        "recomendacao": "Original preferível",
        "marcas_confiaveis_paralelas": ["Fras-le", "Cobreq", "TRW", "Bosch"],
        "marcas_evitar": ["Marcas desconhecidas com preço muito abaixo do mercado."],
        "risco_uso_inferior": "Perda de eficiência de frenagem, ruído excessivo, desgaste prematuro do disco e falha no sensor de alerta."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Veículos populares e médios"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Pastilhas de veículos com freio a tambor traseiro não servem em veículos com disco traseiro, mesmo que o modelo seja o mesmo."],
        "adaptacoes_proibidas": ["Lixar a pastilha para encaixar, cortar o fio do sensor."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Ferramenta para recolher o pistão da pinça."],
        "calibracao_necessaria": "Não se aplica",
        "torque_critico": "Parafusos da pinça (geralmente entre 80Nm e 120Nm)."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Ausência de defeitos de fabricação, ruído excessivo (se não for característica do composto) e desgaste prematuro.",
        "condicoes_perda_garantia": ["Uso de fluido de freio incorreto, instalação incorreta, uso em condições extremas (pista)."]
      },
      "checklist_entrega": [
        "Verificar o nível e a cor do fluido de freio.",
        "Conferir o torque dos parafusos da roda.",
        "Realizar o assentamento das pastilhas (procedimento de frenagem suave)."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Módulo Hidráulico ABS/ESP",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar módulo sem a codificação correta (pode gerar falha no sistema de estabilidade - ESP).",
        "Não fazer a sangria do módulo (necessário scanner em alguns modelos)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Código da peça original (crucial).", "Número de válvulas e pinos."],
        "medicoes": ["Não se aplica"],
        "visual": ["Tipo de conector e número de tubulações."],
        "vin_decoding": "Sim, para o código exato do módulo."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Não se aplica",
        "com_sensor": "Sim",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Com ou sem ESP/ASR."
      },
      "original_vs_paralela": {
        "recomendacao": "Sempre original",
        "marcas_confiaveis_paralelas": ["Bosch", "Continental", "TRW"],
        "marcas_evitar": ["Módulos usados sem garantia de procedência."],
        "risco_uso_inferior": "Falha total do ABS/ESP, perda de controle do veículo em frenagens de emergência."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos com ABS"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Módulo de carro sem ESP em carro com ESP."],
        "adaptacoes_proibidas": ["Tentar reparar a placa eletrônica sem o equipamento adequado."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Scanner para codificação e sangria do módulo."],
        "calibracao_necessaria": "Sim, codificação e sangria eletrônica.",
        "torque_critico": "Porcas de fixação das tubulações (aperto correto para vedação)."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento eletrônico e hidráulico.",
        "condicoes_perda_garantia": ["Uso de fluido de freio incorreto ou contaminação."]
      },
      "checklist_entrega": [
        "Fazer a sangria eletrônica do módulo com o scanner.",
        "Apagar códigos de falha e testar o sistema em movimento."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Discos de Freio Ventilados Dianteiros (Diâmetro Variável)",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar disco de diâmetro menor que o original (a pinça não abraça o disco corretamente).",
        "Não medir a espessura mínima do disco antes da instalação de pastilhas novas."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Diâmetro externo (mm)", "Espessura total (mm)", "Número de furos de fixação."],
        "medicoes": ["Diâmetro externo e espessura mínima."],
        "visual": ["Tipo de ventilação (reta, curva) e se é sólido ou ventilado."],
        "vin_decoding": "Sim, para identificar o diâmetro correto (alguns modelos usam 280mm e outros 300mm)."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica (vendido em par)",
        "eixo": "Dianteiro",
        "com_sensor": "Não se aplica",
        "diametro": "Varia de 236mm a 340mm",
        "furos": "4, 5 ou 6 furos",
        "outras": "Com ou sem cubo integrado."
      },
      "original_vs_paralela": {
        "recomendacao": "Original preferível",
        "marcas_confiaveis_paralelas": ["Fremax", "Hipper Freios", "TRW", "Varga"],
        "marcas_evitar": ["Discos sem certificação INMETRO."],
        "risco_uso_inferior": "Empenamento (vibração no pedal), trincas e falha total de frenagem por superaquecimento."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Ampla gama de veículos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Discos de 4 furos não servem em 5 furos. Discos de diâmetro diferente do original não cabem na pinça."],
        "adaptacoes_proibidas": ["Usar calços ou adaptadores para mudar o diâmetro ou furação."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Micrômetro para medir a espessura e o empenamento lateral."],
        "calibracao_necessaria": "Não se aplica",
        "torque_critico": "Parafusos da pinça e da roda (crucial para evitar empenamento)."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Ausência de defeitos de fabricação e empenamento prematuro (se instalado corretamente).",
        "condicoes_perda_garantia": ["Uso de pastilhas inadequadas, instalação sem limpeza do cubo, aperto incorreto das rodas."]
      },
      "checklist_entrega": [
        "Limpar o cubo da roda antes de instalar o disco.",
        "Verificar o empenamento lateral após a instalação (máximo 0,05mm).",
        "Apertar as rodas com torquímetro no padrão estrela."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Cilindro Mestre (Diâmetro Variável)",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar cilindro de diâmetro diferente do original (muda a pressão e o curso do pedal)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Diâmetro interno do cilindro (mm).", "Tipo de freio (disco/tambor, ABS/sem ABS)."],
        "medicoes": ["Diâmetro interno."],
        "visual": ["Número de saídas de fluido e tipo de reservatório."],
        "vin_decoding": "Sim, para o diâmetro e sistema de freio."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Não se aplica",
        "com_sensor": "Sim, sensor de nível de fluido.",
        "diametro": "Varia de 19mm a 25mm",
        "furos": "Não se aplica",
        "outras": "Com ou sem válvula equalizadora integrada."
      },
      "original_vs_paralela": {
        "recomendacao": "Sempre original",
        "marcas_confiaveis_paralelas": ["ATE", "TRW", "Bosch"],
        "marcas_evitar": ["Cilindros recondicionados de procedência duvidosa."],
        "risco_uso_inferior": "Falha total do sistema de freio, vazamento interno (pedal afunda lentamente)."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Diâmetro diferente do original."],
        "adaptacoes_proibidas": ["Reaproveitar o reservatório se estiver sujo ou trincado."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Sangrador de freio a vácuo ou pressurizado."],
        "calibracao_necessaria": "Sim, sangria completa do sistema e, em alguns casos, calibração do sensor de pressão.",
        "torque_critico": "Parafusos de fixação no servo-freio."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Vedação perfeita e funcionamento hidráulico.",
        "condicoes_perda_garantia": ["Uso de fluido de freio contaminado ou incorreto."]
      },
      "checklist_entrega": [
        "Fazer a pré-sangria do cilindro mestre antes da instalação.",
        "Sangria completa das 4 rodas (começando pela mais distante).",
        "Teste de pedal (firmeza e curso)."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Servo-Freio (Simples/Duplo Estágio)",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar servo-freio com diâmetro ou estágio (simples/duplo) diferente do original (muda a assistência e o curso do pedal)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Diâmetro do corpo (polegadas)", "Estágios (simples ou duplo)."],
        "medicoes": ["Diâmetro."],
        "visual": ["Número de estágios e tipo de conexão com o cilindro mestre."],
        "vin_decoding": "Sim, para o diâmetro e estágio."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Não se aplica",
        "com_sensor": "Não se aplica",
        "diametro": "Varia de 7 a 11 polegadas",
        "furos": "Não se aplica",
        "outras": "Com ou sem haste ajustável."
      },
      "original_vs_paralela": {
        "recomendacao": "Sempre original",
        "marcas_confiaveis_paralelas": ["TRW", "Bosch", "ContiTech"],
        "marcas_evitar": ["Peças recondicionadas sem garantia de fábrica."],
        "risco_uso_inferior": "Perda de assistência de freio (pedal duro) ou assistência excessiva (freio muito sensível)."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Servo-freio simples no lugar de duplo."],
        "adaptacoes_proibidas": ["Ajustar a haste de acionamento sem o gabarito correto."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Não se aplica"],
        "calibracao_necessaria": "Sim, ajuste da haste de acionamento (se aplicável).",
        "torque_critico": "Porcas de fixação no painel corta-fogo."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Vedação e assistência de vácuo.",
        "condicoes_perda_garantia": ["Instalação incorreta do cilindro mestre ou da mangueira de vácuo."]
      },
      "checklist_entrega": [
        "Teste de estanqueidade do vácuo (pedal deve ficar duro após 3 bombadas com o motor desligado).",
        "Verificar o torque das porcas de fixação."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Lonas e Sapatas de Freio Traseiras (Diâmetro Variável)",
      "importancia_seguranca": "Alta",
      "erros_comuns": [
        "Não trocar o cilindro de roda junto com as lonas (risco de vazamento).",
        "Não fazer a regulagem correta do freio de estacionamento."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Diâmetro do tambor (mm)", "Largura da lona (mm)."],
        "medicoes": ["Diâmetro interno do tambor (para verificar se precisa de retífica)."],
        "visual": ["Formato da sapata e tipo de mola."],
        "vin_decoding": "Sim, para o diâmetro do tambor."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica (vendida em jogo)",
        "eixo": "Traseiro",
        "com_sensor": "Não se aplica",
        "diametro": "Varia de 180mm a 250mm",
        "furos": "Não se aplica",
        "outras": "Com ou sem alavanca de freio de mão integrada."
      },
      "original_vs_paralela": {
        "recomendacao": "Paralela de qualidade OK",
        "marcas_confiaveis_paralelas": ["Fras-le", "Cobreq", "Bosch", "TRW"],
        "marcas_evitar": ["Lonas com rebitagem mal feita."],
        "risco_uso_inferior": "Frenagem ineficiente, ruído e travamento da roda."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Veículos populares"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Lona de diâmetro diferente do tambor."],
        "adaptacoes_proibidas": ["Reaproveitar molas e reguladores enferrujados."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Ferramenta para instalação de molas."],
        "calibracao_necessaria": "Sim, regulagem da folga da lona e do freio de estacionamento.",
        "torque_critico": "Porca do eixo (se aplicável)."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Eficiência de frenagem e ausência de ruído.",
        "condicoes_perda_garantia": ["Tambor ovalizado ou retificado incorretamente."]
      },
      "checklist_entrega": [
        "Verificar o estado do tambor (retífica ou troca).",
        "Lubrificar os pontos de contato da sapata com o espelho.",
        "Regulagem do freio de estacionamento."
      ]
    },
    {
      "categoria": "Freios",
      "peca": "Cilindro de Roda (Diâmetro Variável)",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Não trocar o cilindro de roda junto com as lonas (risco de vazamento).",
        "Instalar cilindro de diâmetro diferente do original (muda a pressão e o curso do pedal)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Diâmetro interno do cilindro (mm).", "Tipo de freio (disco/tambor, ABS/sem ABS)."],
        "medicoes": ["Diâmetro interno."],
        "visual": ["Número de saídas de fluido e tipo de reservatório."],
        "vin_decoding": "Sim, para o diâmetro e sistema de freio."
      },
      "especificacoes_variaveis": {
        "lado": "Traseiro Esquerdo/Direito",
        "eixo": "Traseiro",
        "com_sensor": "Não se aplica",
        "diametro": "Varia de 19mm a 25mm",
        "furos": "Não se aplica",
        "outras": "Com ou sem válvula equalizadora integrada."
      },
      "original_vs_paralela": {
        "recomendacao": "Sempre original",
        "marcas_confiaveis_paralelas": ["ATE", "TRW", "Bosch"],
        "marcas_evitar": ["Cilindros recondicionados de procedência duvidosa."],
        "risco_uso_inferior": "Falha total do sistema de freio, vazamento interno (pedal afunda lentamente)."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Diâmetro diferente do original."],
        "adaptacoes_proibidas": ["Reaproveitar o reservatório se estiver sujo ou trincado."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Sangrador de freio a vácuo ou pressurizado."],
        "calibracao_necessaria": "Sim, sangria completa do sistema e, em alguns casos, calibração do sensor de pressão.",
        "torque_critico": "Parafusos de fixação no espelho."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Vedação perfeita e funcionamento hidráulico.",
        "condicoes_perda_garantia": ["Uso de fluido de freio contaminado ou incorreto."]
      },
      "checklist_entrega": [
        "Fazer a pré-sangria do cilindro mestre antes da instalação.",
        "Sangria completa das 4 rodas (começando pela mais distante).",
        "Teste de pedal (firmeza e curso)."
      ]
    }
,
    {
      "categoria": "Suspensão",
      "peca": "Amortecedores Dianteiros",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar amortecedor de modelo/ano diferente (altera a altura e a estabilidade do veículo).",
        "Não trocar o kit de suspensão (coxim, batente, coifa) junto com o amortecedor."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Lado (direito/esquerdo)", "Tipo de amortecedor (pressurizado, convencional)."],
        "medicoes": ["Não se aplica"],
        "visual": ["Formato do corpo e dos pontos de fixação."],
        "vin_decoding": "Sim, para o tipo de suspensão (normal, esportiva, reforçada)."
      },
      "especificacoes_variaveis": {
        "lado": "Direito/Esquerdo",
        "eixo": "Dianteiro",
        "com_sensor": "Não se aplica",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Pressurização (gás ou óleo)."
      },
      "original_vs_paralela": {
        "recomendacao": "Original preferível",
        "marcas_confiaveis_paralelas": ["Cofap", "Monroe", "Nakata"],
        "marcas_evitar": ["Amortecedores recondicionados sem certificação INMETRO."],
        "risco_uso_inferior": "Perda de estabilidade, desgaste prematuro de pneus, quebra do amortecedor."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Amortecedor de veículo sem ABS em veículo com ABS (pode não ter o suporte do sensor)."],
        "adaptacoes_proibidas": ["Soldar ou adaptar pontos de fixação."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Encolhedor de molas."],
        "calibracao_necessaria": "Sim, alinhamento e cambagem após a troca.",
        "torque_critico": "Porca superior do amortecedor e parafusos de fixação na manga de eixo."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento hidráulico e ausência de vazamentos.",
        "condicoes_perda_garantia": ["Instalação incorreta, uso de molas cortadas ou fora de especificação."]
      },
      "checklist_entrega": [
        "Verificar o torque de todos os parafusos.",
        "Fazer o alinhamento e a cambagem."
      ]
    },
    {
      "categoria": "Suspensão",
      "peca": "Pivôs de Suspensão",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Não verificar a folga do pivô antes da instalação (pode vir com defeito de fábrica).",
        "Reaproveitar porcas e parafusos de fixação."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Lado (superior/inferior, direito/esquerdo)", "Diâmetro do pino."],
        "medicoes": ["Diâmetro do pino."],
        "visual": ["Formato do corpo e número de furos de fixação."],
        "vin_decoding": "Sim, para o tipo de bandeja (aço ou alumínio)."
      },
      "especificacoes_variaveis": {
        "lado": "Superior/Inferior, Direito/Esquerdo",
        "eixo": "Dianteiro",
        "com_sensor": "Não se aplica",
        "diametro": "Varia de 15mm a 22mm",
        "furos": "2, 3 ou 4 furos",
        "outras": "Rebitado ou parafusado na bandeja."
      },
      "original_vs_paralela": {
        "recomendacao": "Original preferível",
        "marcas_confiaveis_paralelas": ["Nakata", "TRW", "Viemar"],
        "marcas_evitar": ["Pivôs sem marca ou com preço muito baixo."],
        "risco_uso_inferior": "Quebra do pivô e desprendimento da roda, causando acidente grave."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Pivô de diâmetro diferente do original (não encaixa ou fica com folga)."],
        "adaptacoes_proibidas": ["Soldar o pivô na bandeja."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Prensa hidráulica para sacar e instalar o pivô."],
        "calibracao_necessaria": "Sim, alinhamento após a troca.",
        "torque_critico": "Porca do pino do pivô e parafusos de fixação na bandeja."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Ausência de folga e resistência à quebra.",
        "condicoes_perda_garantia": ["Instalação incorreta, uso de ferramentas inadequadas (marreta).", "Coifa de proteção rasgada."]
      },
      "checklist_entrega": [
        "Verificar a folga do pivô após a instalação.",
        "Fazer o alinhamento."
      ]
    },
    {
      "categoria": "Direção",
      "peca": "Caixa de Direção Hidráulica/Elétrica",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar caixa de direção recondicionada de baixa qualidade (risco de travamento).",
        "Não fazer a sangria correta do sistema hidráulico."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Tipo de direção (hidráulica, elétrica, eletro-hidráulica).", "Código da peça original."],
        "medicoes": ["Não se aplica"],
        "visual": ["Tipo de conexões hidráulicas e elétricas."],
        "vin_decoding": "Sim, para o tipo exato de sistema de direção."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Dianteiro",
        "com_sensor": "Sim, sensor de ângulo de direção (em sistemas elétricos).",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Com ou sem barra axial integrada."
      },
      "original_vs_paralela": {
        "recomendacao": "Sempre original ou recondicionada por empresa especializada com garantia.",
        "marcas_confiaveis_paralelas": ["TRW", "JTEKT", "ZF"],
        "marcas_evitar": ["Caixas recondicionadas sem garantia."],
        "risco_uso_inferior": "Travamento da direção, perda de assistência, vazamentos."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Caixa de direção hidráulica no lugar de elétrica."],
        "adaptacoes_proibidas": ["Tentar reparar a cremalheira ou o pinhão sem o equipamento adequado."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Scanner para calibração do sensor de ângulo de direção."],
        "calibracao_necessaria": "Sim, calibração do sensor de ângulo e sangria do sistema hidráulico.",
        "torque_critico": "Parafusos de fixação da caixa no quadro da suspensão."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento suave, sem folgas ou vazamentos.",
        "condicoes_perda_garantia": ["Uso de fluido de direção incorreto, contaminação do sistema."]
      },
      "checklist_entrega": [
        "Verificar o nível e a cor do fluido de direção.",
        "Fazer o alinhamento.",
        "Verificar se não há ruídos ou vibrações ao esterçar."
      ]
    },
    {
      "categoria": "Direção",
      "peca": "Terminal de Direção",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Não trocar o terminal em par (direito e esquerdo).",
        "Não fazer o alinhamento após a troca."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Lado (direito/esquerdo)", "Tipo de rosca (macho/fêmea)."],
        "medicoes": ["Comprimento total."],
        "visual": ["Formato do corpo e tipo de pino."],
        "vin_decoding": "Sim, para o tipo de rosca."
      },
      "especificacoes_variaveis": {
        "lado": "Direito/Esquerdo",
        "eixo": "Dianteiro",
        "com_sensor": "Não se aplica",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Com ou sem graxeira."
      },
      "original_vs_paralela": {
        "recomendacao": "Original preferível",
        "marcas_confiaveis_paralelas": ["Nakata", "TRW", "Viemar"],
        "marcas_evitar": ["Terminais sem marca ou com preço muito baixo."],
        "risco_uso_inferior": "Quebra do terminal e perda de controle da direção."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Terminal com rosca diferente da barra axial."],
        "adaptacoes_proibidas": ["Soldar o terminal na barra axial."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Saca-terminal."],
        "calibracao_necessaria": "Sim, alinhamento completo após a troca.",
        "torque_critico": "Porca do pino do terminal."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Ausência de folga e resistência à quebra.",
        "condicoes_perda_garantia": ["Instalação incorreta, coifa de proteção rasgada."]
      },
      "checklist_entrega": [
        "Verificar a folga do terminal após a instalação.",
        "Fazer o alinhamento."
      ]
    }
,
    {
      "categoria": "Pneus e Rodas",
      "peca": "Pneu (Modelo e Medida)",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar pneu com índice de carga ou velocidade inferior ao especificado (risco de estouro).",
        "Instalar pneu de medida diferente sem autorização (multa e risco de segurança)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Medida (Ex: 205/55 R16)", "Índice de Carga e Velocidade (Ex: 91V)."],
        "medicoes": ["Profundidade dos sulcos (mínimo 1,6mm)."],
        "visual": ["Data de fabricação (DOT) e TWI (indicador de desgaste)."],
        "vin_decoding": "Sim, para a medida original de fábrica."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Não se aplica",
        "com_sensor": "Sim (TPMS - Sensor de Pressão)",
        "diametro": "R14 a R22",
        "furos": "Não se aplica",
        "outras": "Tipo (Radial, Diagonal), Treadwear, Tração, Temperatura."
      },
      "original_vs_paralela": {
        "recomendacao": "Marca de 1ª linha",
        "marcas_confiaveis_paralelas": ["Pirelli", "Michelin", "Continental", "Goodyear"],
        "marcas_evitar": ["Pneus remoldados sem selo INMETRO."],
        "risco_uso_inferior": "Aquaplanagem, estouro, desgaste irregular, multa."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Índice de carga/velocidade inferior."],
        "adaptacoes_proibidas": ["Pneu com sulco abaixo de 1,6mm."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Máquina de montar e balanceadora."],
        "calibracao_necessaria": "Sim, balanceamento e alinhamento.",
        "torque_critico": "Parafusos/porcas da roda."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Ausência de defeitos de fabricação.",
        "condicoes_perda_garantia": ["Uso incorreto, rodar com pressão baixa, danos por buracos."]
      },
      "checklist_entrega": [
        "Calibragem correta (incluindo estepe).",
        "Balanceamento e alinhamento realizados.",
        "Torque correto nas rodas."
      ]
    },
    {
      "categoria": "Pneus e Rodas",
      "peca": "Sensor TPMS (Pressão dos Pneus)",
      "importancia_seguranca": "Alta",
      "erros_comuns": [
        "Instalar sensor sem a calibração/pareamento correto (luz de anomalia acesa).",
        "Dano ao sensor durante a montagem do pneu."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Frequência de transmissão (315 MHz ou 433 MHz).", "Código da peça original."],
        "medicoes": ["Não se aplica"],
        "visual": ["Formato da válvula e corpo do sensor."],
        "vin_decoding": "Sim, para a frequência correta."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Não se aplica",
        "com_sensor": "Sim",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Frequência de transmissão."
      },
      "original_vs_paralela": {
        "recomendacao": "Original ou de marca homologada",
        "marcas_confiaveis_paralelas": ["Schrader", "Continental"],
        "marcas_evitar": ["Sensores genéricos sem marca."],
        "risco_uso_inferior": "Leitura incorreta da pressão, falha do sistema de segurança."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Veículos com TPMS"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Frequência de transmissão incorreta."],
        "adaptacoes_proibidas": ["Usar sensor de frequência diferente."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Ferramenta de pareamento/ativação do TPMS."],
        "calibracao_necessaria": "Sim, pareamento com a central do veículo.",
        "torque_critico": "Porca de fixação do sensor na roda."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Leitura e transmissão correta da pressão.",
        "condicoes_perda_garantia": ["Dano físico ao sensor durante a montagem do pneu."]
      },
      "checklist_entrega": [
        "Luz do TPMS apagada no painel.",
        "Leitura correta da pressão em todas as rodas."
      ]
    },
    {
      "categoria": "Pneus e Rodas",
      "peca": "Válvula de Pneu (Bico)",
      "importancia_seguranca": "Alta",
      "erros_comuns": [
        "Reaproveitar válvula antiga (risco de vazamento lento).",
        "Instalar válvula de borracha em roda de liga leve (deve ser de metal)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Tipo de roda (aço ou liga leve)", "Comprimento."],
        "medicoes": ["Não se aplica"],
        "visual": ["Material (borracha, metal)."],
        "vin_decoding": "Não se aplica"
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Não se aplica",
        "com_sensor": "Não se aplica",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Material e comprimento."
      },
      "original_vs_paralela": {
        "recomendacao": "Paralela de qualidade OK",
        "marcas_confiaveis_paralelas": ["Schrader", "Vipal"],
        "marcas_evitar": ["Válvulas de borracha de baixa qualidade."],
        "risco_uso_inferior": "Perda de pressão do pneu, risco de acidente."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Válvula de borracha em roda de liga leve."],
        "adaptacoes_proibidas": ["Usar válvula de caminhão em carro de passeio."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Extrator de válvula."],
        "calibracao_necessaria": "Não se aplica",
        "torque_critico": "Não se aplica"
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Vedação e resistência.",
        "condicoes_perda_garantia": ["Dano físico à válvula."]
      },
      "checklist_entrega": [
        "Trocar a válvula a cada troca de pneu.",
        "Verificar se não há vazamento após a instalação."
      ]
    },
    {
      "categoria": "Pneus e Rodas",
      "peca": "Parafusos/Porcas de Roda",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Apertar com torque incorreto (aperto excessivo estica o prisioneiro, aperto insuficiente solta a roda).",
        "Usar parafuso/porca de rosca diferente (espanamento)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Tipo de rosca (M12x1.5, M14x1.5)", "Tipo de assento (cônico, esférico)."],
        "medicoes": ["Comprimento da rosca."],
        "visual": ["Tipo de assento."],
        "vin_decoding": "Sim, para o tipo de rosca e torque."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Não se aplica",
        "com_sensor": "Não se aplica",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Tipo de assento e comprimento."
      },
      "original_vs_paralela": {
        "recomendacao": "Original preferível",
        "marcas_confiaveis_paralelas": ["McGard", "Gorilla"],
        "marcas_evitar": ["Parafusos/porcas de material macio."],
        "risco_uso_inferior": "Soltura da roda, quebra do prisioneiro."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Assento cônico em roda esférica (e vice-versa)."],
        "adaptacoes_proibidas": ["Usar parafuso/porca de rosca diferente."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Torquímetro."],
        "calibracao_necessaria": "Não se aplica",
        "torque_critico": "Sim, torque específico para cada veículo."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Resistência e rosca correta.",
        "condicoes_perda_garantia": ["Aperto com torque incorreto."]
      },
      "checklist_entrega": [
        "Apertar com torquímetro no padrão estrela.",
        "Informar o cliente sobre o torque correto."
      ]
    },
    {
      "categoria": "Pneus e Rodas",
      "peca": "Roda (Liga Leve ou Aço)",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar roda com offset (ET) incorreto (risco de raspar na suspensão ou na carroceria).",
        "Instalar roda com furação (PCD) diferente (risco de soltura)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Diâmetro (R)", "Largura (J)", "Offset (ET)", "Furação (PCD)."],
        "medicoes": ["Não se aplica"],
        "visual": ["Furação e offset."],
        "vin_decoding": "Sim, para a especificação original."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Não se aplica",
        "com_sensor": "Não se aplica",
        "diametro": "R14 a R22",
        "furos": "4x100, 5x112, etc.",
        "outras": "Offset (ET)."
      },
      "original_vs_paralela": {
        "recomendacao": "Original ou de marca homologada",
        "marcas_confiaveis_paralelas": ["Krmai", "Scorro", "Tala"],
        "marcas_evitar": ["Rodas de procedência duvidosa."],
        "risco_uso_inferior": "Quebra da roda, vibração, desgaste irregular de pneus."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Furação (PCD) diferente."],
        "adaptacoes_proibidas": ["Usar espaçadores de roda sem homologação."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Torquímetro."],
        "calibracao_necessaria": "Sim, balanceamento e alinhamento.",
        "torque_critico": "Parafusos/porcas da roda."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Ausência de defeitos de fabricação.",
        "condicoes_perda_garantia": ["Dano por buracos, uso incorreto."]
      },
      "checklist_entrega": [
        "Verificar o torque dos parafusos/porcas.",
        "Balanceamento e alinhamento realizados."
      ]
    },
    {
      "categoria": "Segurança Passiva",
      "peca": "Airbag (Módulo, Bolsas, Sensores)",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar módulo ou bolsa de airbag usado ou recondicionado (risco de não disparar ou disparar indevidamente).",
        "Não apagar os códigos de falha após o reparo."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Código da peça original (crucial).", "Lado (motorista, passageiro, cortina)."],
        "medicoes": ["Não se aplica"],
        "visual": ["Cor do conector e número de pinos."],
        "vin_decoding": "Sim, para o código exato da peça."
      },
      "especificacoes_variaveis": {
        "lado": "Motorista/Passageiro/Cortina",
        "eixo": "Não se aplica",
        "com_sensor": "Sim",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Com ou sem sensor de ocupação."
      },
      "original_vs_paralela": {
        "recomendacao": "Sempre original",
        "marcas_confiaveis_paralelas": ["Não se aplica"],
        "marcas_evitar": ["Peças usadas ou recondicionadas."],
        "risco_uso_inferior": "Falha no disparo do airbag, risco de morte."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Veículos com Airbag"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Módulo de airbag de carro sem sensor de ocupação em carro com sensor."],
        "adaptacoes_proibidas": ["Tentar reparar a bolsa ou o módulo."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Scanner para apagar códigos de falha e pareamento."],
        "calibracao_necessaria": "Sim, calibração do sensor de ocupação (se aplicável).",
        "torque_critico": "Parafusos de fixação do módulo e das bolsas."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento correto do sistema.",
        "condicoes_perda_garantia": ["Instalação incorreta, dano físico à peça."]
      },
      "checklist_entrega": [
        "Luz do airbag apagada no painel.",
        "Verificar o torque dos parafusos."
      ]
    },
    {
      "categoria": "Segurança Passiva",
      "peca": "Cinto de Segurança (Retrator e Pré-tensionador)",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar cinto de segurança usado ou recondicionado (risco de não travar ou não pré-tensionar).",
        "Não trocar o cinto após um acidente (o pré-tensionador pode ter sido acionado)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Código da peça original.", "Lado (motorista, passageiro, traseiro)."],
        "medicoes": ["Não se aplica"],
        "visual": ["Cor do conector e número de pinos."],
        "vin_decoding": "Sim, para o código exato da peça."
      },
      "especificacoes_variaveis": {
        "lado": "Motorista/Passageiro/Traseiro",
        "eixo": "Não se aplica",
        "com_sensor": "Sim (sensor de afivelamento)",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Com ou sem pré-tensionador."
      },
      "original_vs_paralela": {
        "recomendacao": "Sempre original",
        "marcas_confiaveis_paralelas": ["Não se aplica"],
        "marcas_evitar": ["Peças usadas ou recondicionadas."],
        "risco_uso_inferior": "Falha no travamento do cinto, risco de morte."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Cinto de segurança de carro sem pré-tensionador em carro com pré-tensionador."],
        "adaptacoes_proibidas": ["Tentar reparar o retrator ou o pré-tensionador."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Torquímetro."],
        "calibracao_necessaria": "Não se aplica",
        "torque_critico": "Parafusos de fixação do cinto na carroceria."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento correto do sistema.",
        "condicoes_perda_garantia": ["Instalação incorreta, dano físico à peça."]
      },
      "checklist_entrega": [
        "Verificar o torque dos parafusos.",
        "Testar o travamento do cinto."
      ]
    },
    {
      "categoria": "Segurança Passiva",
      "peca": "Módulo de Controle do Airbag (ACU)",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar módulo de airbag sem a programação correta (risco de não disparar ou disparar indevidamente).",
        "Não apagar os códigos de falha após o reparo."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Código da peça original (crucial).", "Número de airbags suportados."],
        "medicoes": ["Não se aplica"],
        "visual": ["Cor do conector e número de pinos."],
        "vin_decoding": "Sim, para o código exato da peça."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Não se aplica",
        "com_sensor": "Sim",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Com ou sem sensor de ocupação."
      },
      "original_vs_paralela": {
        "recomendacao": "Sempre original",
        "marcas_confiaveis_paralelas": ["Não se aplica"],
        "marcas_evitar": ["Peças usadas ou recondicionadas."],
        "risco_uso_inferior": "Falha no disparo do airbag, risco de morte."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Veículos com Airbag"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Módulo de airbag de carro sem sensor de ocupação em carro com sensor."],
        "adaptacoes_proibidas": ["Tentar reparar o módulo."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Scanner para apagar códigos de falha e pareamento."],
        "calibracao_necessaria": "Sim, calibração do sensor de ocupação (se aplicável).",
        "torque_critico": "Parafusos de fixação do módulo."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento correto do sistema.",
        "condicoes_perda_garantia": ["Instalação incorreta, dano físico à peça."]
      },
      "checklist_entrega": [
        "Luz do airbag apagada no painel.",
        "Verificar o torque dos parafusos."
      ]
    },
    {
      "categoria": "Segurança Passiva",
      "peca": "Sensor de Colisão (Airbag)",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar sensor de colisão usado ou recondicionado (risco de não disparar ou disparar indevidamente).",
        "Não apagar os códigos de falha após o reparo."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Código da peça original (crucial).", "Lado (dianteiro, lateral, traseiro)."],
        "medicoes": ["Não se aplica"],
        "visual": ["Cor do conector e número de pinos."],
        "vin_decoding": "Sim, para o código exato da peça."
      },
      "especificacoes_variaveis": {
        "lado": "Dianteiro/Lateral/Traseiro",
        "eixo": "Não se aplica",
        "com_sensor": "Sim",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Tipo de sensor (aceleração, pressão)."
      },
      "original_vs_paralela": {
        "recomendacao": "Sempre original",
        "marcas_confiaveis_paralelas": ["Não se aplica"],
        "marcas_evitar": ["Peças usadas ou recondicionadas."],
        "risco_uso_inferior": "Falha no disparo do airbag, risco de morte."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Veículos com Airbag"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Sensor de colisão de carro sem sensor de ocupação em carro com sensor."],
        "adaptacoes_proibidas": ["Tentar reparar o sensor."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Scanner para apagar códigos de falha e pareamento."],
        "calibracao_necessaria": "Não se aplica",
        "torque_critico": "Parafusos de fixação do sensor."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento correto do sistema.",
        "condicoes_perda_garantia": ["Instalação incorreta, dano físico à peça."]
      },
      "checklist_entrega": [
        "Luz do airbag apagada no painel.",
        "Verificar o torque dos parafusos."
      ]
    },
    {
      "categoria": "Segurança Passiva",
      "peca": "Volante com Airbag",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar volante com airbag usado ou recondicionado (risco de não disparar ou disparar indevidamente).",
        "Não apagar os códigos de falha após o reparo."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Código da peça original (crucial).", "Tipo de volante (com ou sem comandos)."],
        "medicoes": ["Não se aplica"],
        "visual": ["Cor do conector e número de pinos."],
        "vin_decoding": "Sim, para o código exato da peça."
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Não se aplica",
        "com_sensor": "Sim",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Com ou sem comandos de som."
      },
      "original_vs_paralela": {
        "recomendacao": "Sempre original",
        "marcas_confiaveis_paralelas": ["Não se aplica"],
        "marcas_evitar": ["Peças usadas ou recondicionadas."],
        "risco_uso_inferior": "Falha no disparo do airbag, risco de morte."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Veículos com Airbag"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Volante com airbag de carro sem sensor de ocupação em carro com sensor."],
        "adaptacoes_proibidas": ["Tentar reparar o airbag."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Scanner para apagar códigos de falha e pareamento."],
        "calibracao_necessaria": "Não se aplica",
        "torque_critico": "Porca de fixação do volante."
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento correto do sistema.",
        "condicoes_perda_garantia": ["Instalação incorreta, dano físico à peça."]
      },
      "checklist_entrega": [
        "Luz do airbag apagada no painel.",
        "Verificar o torque da porca do volante."
      ]
    },
    {
      "categoria": "Iluminação",
      "peca": "Farol Principal (Xenon/LED)",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar farol de modelo diferente (altera o foco e a iluminação).",
        "Não fazer a regulagem correta do farol."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Tipo de lâmpada (H4, H7, Xenon, LED)", "Lado (direito/esquerdo)."],
        "medicoes": ["Não se aplica"],
        "visual": ["Formato e tipo de lâmpada."],
        "vin_decoding": "Sim, para o tipo de farol."
      },
      "especificacoes_variaveis": {
        "lado": "Direito/Esquerdo",
        "eixo": "Dianteiro",
        "com_sensor": "Sim (sensor de nivelamento automático)",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Com ou sem DRL (luz diurna)."
      },
      "original_vs_paralela": {
        "recomendacao": "Original preferível",
        "marcas_confiaveis_paralelas": ["Osram", "Philips", "Hella"],
        "marcas_evitar": ["Faróis genéricos sem selo INMETRO."],
        "risco_uso_inferior": "Iluminação deficiente, ofuscamento de outros motoristas."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Farol de Xenon em carro sem Xenon (exige reator e chicote)."],
        "adaptacoes_proibidas": ["Usar lâmpada de potência superior à especificada."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Regulador de farol."],
        "calibracao_necessaria": "Sim, regulagem do foco.",
        "torque_critico": "Não se aplica"
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento e vedação.",
        "condicoes_perda_garantia": ["Uso de lâmpada de potência superior, dano físico à lente."]
      },
      "checklist_entrega": [
        "Regulagem correta do foco.",
        "Verificar se todas as lâmpadas estão funcionando."
      ]
    },
    {
      "categoria": "Iluminação",
      "peca": "Lâmpada de Freio (LED)",
      "importancia_seguranca": "Crítica",
      "erros_comuns": [
        "Instalar lâmpada de freio com potência inferior (baixa visibilidade).",
        "Instalar lâmpada de LED sem o resistor (causa erro no painel)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Tipo de lâmpada (P21W, W5W, LED)", "Potência (W)."],
        "medicoes": ["Não se aplica"],
        "visual": ["Tipo de encaixe e potência."],
        "vin_decoding": "Não se aplica"
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Traseiro",
        "com_sensor": "Não se aplica",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Potência e tipo de encaixe."
      },
      "original_vs_paralela": {
        "recomendacao": "Paralela de qualidade OK",
        "marcas_confiaveis_paralelas": ["Osram", "Philips"],
        "marcas_evitar": ["Lâmpadas genéricas sem marca."],
        "risco_uso_inferior": "Baixa visibilidade do freio, risco de colisão traseira."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Lâmpada de freio de potência inferior."],
        "adaptacoes_proibidas": ["Usar lâmpada de potência superior à especificada."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Não se aplica"],
        "calibracao_necessaria": "Não se aplica",
        "torque_critico": "Não se aplica"
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento e durabilidade.",
        "condicoes_perda_garantia": ["Uso de lâmpada de potência superior, dano físico à lente."]
      },
      "checklist_entrega": [
        "Verificar o funcionamento do freio e da luz de freio."
      ]
    },
    {
      "categoria": "Iluminação",
      "peca": "Lâmpada de Seta (Âmbar)",
      "importancia_seguranca": "Alta",
      "erros_comuns": [
        "Instalar lâmpada de seta com potência inferior (baixa visibilidade).",
        "Instalar lâmpada de seta de cor incorreta (não âmbar)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Tipo de lâmpada (P21W, W5W, LED)", "Potência (W)."],
        "medicoes": ["Não se aplica"],
        "visual": ["Tipo de encaixe e potência."],
        "vin_decoding": "Não se aplica"
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Dianteiro/Traseiro",
        "com_sensor": "Não se aplica",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Potência e tipo de encaixe."
      },
      "original_vs_paralela": {
        "recomendacao": "Paralela de qualidade OK",
        "marcas_confiaveis_paralelas": ["Osram", "Philips"],
        "marcas_evitar": ["Lâmpadas genéricas sem marca."],
        "risco_uso_inferior": "Baixa visibilidade da seta, risco de colisão lateral."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Lâmpada de seta de potência inferior."],
        "adaptacoes_proibidas": ["Usar lâmpada de potência superior à especificada."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Não se aplica"],
        "calibracao_necessaria": "Não se aplica",
        "torque_critico": "Não se aplica"
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento e durabilidade.",
        "condicoes_perda_garantia": ["Uso de lâmpada de potência superior, dano físico à lente."]
      },
      "checklist_entrega": [
        "Verificar o funcionamento da seta."
      ]
    },
    {
      "categoria": "Iluminação",
      "peca": "Lâmpada de Ré",
      "importancia_seguranca": "Alta",
      "erros_comuns": [
        "Instalar lâmpada de ré com potência inferior (baixa visibilidade).",
        "Instalar lâmpada de ré de cor incorreta (não branca)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Tipo de lâmpada (P21W, W5W, LED)", "Potência (W)."],
        "medicoes": ["Não se aplica"],
        "visual": ["Tipo de encaixe e potência."],
        "vin_decoding": "Não se aplica"
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Traseiro",
        "com_sensor": "Não se aplica",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Potência e tipo de encaixe."
      },
      "original_vs_paralela": {
        "recomendacao": "Paralela de qualidade OK",
        "marcas_confiaveis_paralelas": ["Osram", "Philips"],
        "marcas_evitar": ["Lâmpadas genéricas sem marca."],
        "risco_uso_inferior": "Baixa visibilidade da ré, risco de colisão traseira."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Lâmpada de ré de potência inferior."],
        "adaptacoes_proibidas": ["Usar lâmpada de potência superior à especificada."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Não se aplica"],
        "calibracao_necessaria": "Não se aplica",
        "torque_critico": "Não se aplica"
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento e durabilidade.",
        "condicoes_perda_garantia": ["Uso de lâmpada de potência superior, dano físico à lente."]
      },
      "checklist_entrega": [
        "Verificar o funcionamento da ré."
      ]
    },
    {
      "categoria": "Iluminação",
      "peca": "Lâmpada de Placa",
      "importancia_seguranca": "Alta",
      "erros_comuns": [
        "Instalar lâmpada de placa com potência inferior (multa).",
        "Instalar lâmpada de placa de cor incorreta (não branca)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Tipo de lâmpada (P21W, W5W, LED)", "Potência (W)."],
        "medicoes": ["Não se aplica"],
        "visual": ["Tipo de encaixe e potência."],
        "vin_decoding": "Não se aplica"
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Traseiro",
        "com_sensor": "Não se aplica",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Potência e tipo de encaixe."
      },
      "original_vs_paralela": {
        "recomendacao": "Paralela de qualidade OK",
        "marcas_confiaveis_paralelas": ["Osram", "Philips"],
        "marcas_evitar": ["Lâmpadas genéricas sem marca."],
        "risco_uso_inferior": "Multa, baixa visibilidade da placa."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Lâmpada de placa de potência inferior."],
        "adaptacoes_proibidas": ["Usar lâmpada de potência superior à especificada."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Não se aplica"],
        "calibracao_necessaria": "Não se aplica",
        "torque_critico": "Não se aplica"
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento e durabilidade.",
        "condicoes_perda_garantia": ["Uso de lâmpada de potência superior, dano físico à lente."]
      },
      "checklist_entrega": [
        "Verificar o funcionamento da luz de placa."
      ]
    },
    {
      "categoria": "Iluminação",
      "peca": "Lâmpada de Neblina",
      "importancia_seguranca": "Alta",
      "erros_comuns": [
        "Instalar lâmpada de neblina com potência inferior (baixa visibilidade).",
        "Instalar lâmpada de neblina de cor incorreta (não amarela ou branca)."
      ],
      "como_identificar_corretamente": {
        "dados_necessarios": ["Tipo de lâmpada (H4, H7, Xenon, LED)", "Potência (W)."],
        "medicoes": ["Não se aplica"],
        "visual": ["Tipo de encaixe e potência."],
        "vin_decoding": "Não se aplica"
      },
      "especificacoes_variaveis": {
        "lado": "Não se aplica",
        "eixo": "Dianteiro/Traseiro",
        "com_sensor": "Não se aplica",
        "diametro": "Não se aplica",
        "furos": "Não se aplica",
        "outras": "Potência e tipo de encaixe."
      },
      "original_vs_paralela": {
        "recomendacao": "Paralela de qualidade OK",
        "marcas_confiaveis_paralelas": ["Osram", "Philips"],
        "marcas_evitar": ["Lâmpadas genéricas sem marca."],
        "risco_uso_inferior": "Baixa visibilidade da neblina, risco de colisão."
      },
      "compatibilidade": {
        "modelos_aplicaveis": ["Todos"],
        "anos": "Todos",
        "incompatibilidades_perigosas": ["Lâmpada de neblina de potência inferior."],
        "adaptacoes_proibidas": ["Usar lâmpada de potência superior à especificada."]
      },
      "instalacao": {
        "profissional_obrigatorio": true,
        "ferramentas_especiais": ["Não se aplica"],
        "calibracao_necessaria": "Não se aplica",
        "torque_critico": "Não se aplica"
      },
      "garantia_legal": {
        "prazo_minimo": "90 dias",
        "o_que_deve_garantir": "Funcionamento e durabilidade.",
        "condicoes_perda_garantia": ["Uso de lâmpada de potência superior, dano físico à lente."]
      },
      "checklist_entrega": [
        "Verificar o funcionamento da luz de neblina."
      ]
    }
  ]
}
