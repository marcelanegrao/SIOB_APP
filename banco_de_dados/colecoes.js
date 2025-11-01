import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb+srv://marcelanegrao_user:SIOBdb44@clustersiob.mabs7pv.mongodb.net/?appName=ClusterSIOB"
const dbName = "appsiob"

async function createSchema() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Conectado ao MongoDB")

    const db = client.db(dbName)

    // ===================================================================
    // 01 - CATÁLOGOS E ESTRUTURA GEOGRÁFICA
    // ===================================================================

    await db.createCollection("municipio", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["nome", "uf"],
          properties: {
            nome: { bsonType: "string", maxLength: 150 },
            uf: { bsonType: "string", pattern: "^[A-Z]{2}$" },
          },
        },
      },
    })
    console.log("Coleção municipio criada")

    await db.createCollection("regiao", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["nome"],
          properties: {
            nome: { bsonType: "string", maxLength: 150 },
            descricao: { bsonType: "string" },
          },
        },
      },
    })
    console.log("Coleção regiao criada")

    await db.createCollection("endereco", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_municipio", "uf"],
          properties: {
            id_municipio: { bsonType: "objectId" },
            logradouro: { bsonType: "string", maxLength: 255 },
            numero: { bsonType: "string", maxLength: 50 },
            complemento: { bsonType: "string", maxLength: 255 },
            bairro: { bsonType: "string", maxLength: 255 },
            uf: { bsonType: "string", pattern: "^[A-Z]{2}$" },
            cep: { bsonType: "string", maxLength: 10 },
            coordenadas: {
              bsonType: "object",
              properties: {
                lat: { bsonType: "double" },
                lon: { bsonType: "double" },
              },
            },
            referencia: { bsonType: "string" },
            codigo_local: { bsonType: "string", maxLength: 100 },
          },
        },
      },
    })
    console.log("Coleção endereco criada")

    await db.createCollection("unidade", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["nome"],
          properties: {
            codigo: { bsonType: "string", maxLength: 50 },
            nome: { bsonType: "string", maxLength: 255 },
            tipo: { bsonType: "string", maxLength: 100 },
            id_municipio: { bsonType: "objectId" },
            id_endereco: { bsonType: "objectId" },
            telefone: { bsonType: "string", maxLength: 50 },
            created_at: { bsonType: "date" },
          },
        },
      },
    })
    await db.collection("unidade").createIndex({ codigo: 1 }, { unique: true })
    console.log(" Coleção unidade criada")

    await db.createCollection("local_permanente", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_endereco"],
          properties: {
            nome: { bsonType: "string", maxLength: 255 },
            id_endereco: { bsonType: "objectId" },
            capacidade: { bsonType: "int" },
            observacoes: { bsonType: "string" },
          },
        },
      },
    })
    console.log(" Coleção local_permanente criada")

    // ===================================================================
    // 02 - CATÁLOGOS OPERACIONAIS
    // ===================================================================

    await db.createCollection("tipo_ocorrencia", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["nome"],
          properties: {
            codigo: { bsonType: "string", maxLength: 50 },
            nome: { bsonType: "string", maxLength: 150 },
            descricao: { bsonType: "string" },
          },
        },
      },
    })
    console.log("Coleção tipo_ocorrencia criada")

    await db.createCollection("natureza_atendimento", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["nome"],
          properties: {
            codigo: { bsonType: "string", maxLength: 50 },
            nome: { bsonType: "string", maxLength: 150 },
            descricao: { bsonType: "string" },
          },
        },
      },
    })
    console.log("Coleção natureza_atendimento criada")

    await db.createCollection("status_ocorrencia", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["nome"],
          properties: {
            nome: { bsonType: "string", maxLength: 100 },
            descricao: { bsonType: "string" },
            cor: { bsonType: "string", maxLength: 7 },
          },
        },
      },
    })
    console.log("Coleção status_ocorrencia criada")

    await db.createCollection("prioridade", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["nome"],
          properties: {
            nome: { bsonType: "string", maxLength: 20 },
          },
        },
      },
    })
    console.log("Coleção prioridade criada")

    await db.createCollection("forma_acionamento", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            nome: { bsonType: "string", maxLength: 100 },
            descricao: { bsonType: "string" },
          },
        },
      },
    })
    console.log("Coleção forma_acionamento criada")

    // ===================================================================
    // 03 - AUTENTICAÇÃO E USUÁRIOS
    // ===================================================================

    await db.createCollection("usuario", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["nome_completo", "email"],
          properties: {
            matricula: { bsonType: "string", maxLength: 50 },
            nome_completo: { bsonType: "string", maxLength: 255 },
            nome_guerra: { bsonType: "string", maxLength: 100 },
            email: { bsonType: "string", maxLength: 255 },
            cpf: { bsonType: "string", maxLength: 20 },
            telefone: { bsonType: "string", maxLength: 50 },
            posto_gradacao: { bsonType: "string", maxLength: 100 },
            id_unidade: { bsonType: "objectId" },
            ativo: { bsonType: "bool" },
            criado_em: { bsonType: "date" },
            atualizado_em: { bsonType: "date" },
          },
        },
      },
    })
    await db.collection("usuario").createIndex({ matricula: 1 }, { unique: true })
    await db.collection("usuario").createIndex({ email: 1 }, { unique: true })
    console.log("Coleção usuario criada")

    await db.createCollection("conta_segura", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_usuario", "senha_hash"],
          properties: {
            id_usuario: { bsonType: "objectId" },
            senha_hash: { bsonType: "string", maxLength: 512 },
            duas_fatores: { bsonType: "bool" },
            secret_2fa: { bsonType: "string", maxLength: 255 },
            alterado_em: { bsonType: "date" },
          },
        },
      },
    })
    await db.collection("conta_segura").createIndex({ id_usuario: 1 }, { unique: true })
    console.log("Coleção conta_segura criada")

    await db.createCollection("papel", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["nome"],
          properties: {
            nome: { bsonType: "string", maxLength: 100 },
            descricao: { bsonType: "string" },
          },
        },
      },
    })
    await db.collection("papel").createIndex({ nome: 1 }, { unique: true })
    console.log("Coleção papel criada")

    await db.createCollection("usuario_papel", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_usuario", "id_papel"],
          properties: {
            id_usuario: { bsonType: "objectId" },
            id_papel: { bsonType: "objectId" },
            atribuido_em: { bsonType: "date" },
          },
        },
      },
    })
    await db.collection("usuario_papel").createIndex({ id_usuario: 1, id_papel: 1 }, { unique: true })
    console.log("Coleção usuario_papel criada")

    // ===================================================================
    // 04 - OCORRÊNCIA PRINCIPAL
    // ===================================================================

    await db.createCollection("ocorrencia", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_tipo", "id_status", "id_endereco"],
          properties: {
            numero_aviso: { bsonType: "string", maxLength: 100 },
            titulo: { bsonType: "string", maxLength: 255 },
            descricao: { bsonType: "string" },
            id_tipo: { bsonType: "objectId" },
            id_natureza: { bsonType: "objectId" },
            id_status: { bsonType: "objectId" },
            id_prioridade: { bsonType: "objectId" },
            id_forma_acionamento: { bsonType: "objectId" },
            id_unidade_responsavel: { bsonType: "objectId" },
            id_endereco: { bsonType: "objectId" },
            area_obm: { bsonType: "bool" },
            data_aviso: { bsonType: "date" },
            hora_recebimento: { bsonType: "string" },
            data_hora_registro: { bsonType: "date" },
            data_hora_fechamento: { bsonType: "date" },
            id_criado_por: { bsonType: "objectId" },
            id_atualizado_por: { bsonType: "objectId" },
            criado_em: { bsonType: "date" },
            atualizado_em: { bsonType: "date" },
          },
        },
      },
    })
    await db.collection("ocorrencia").createIndex({ numero_aviso: 1 }, { unique: true })
    await db.collection("ocorrencia").createIndex({ data_hora_registro: 1 })
    await db.collection("ocorrencia").createIndex({ id_status: 1 })
    await db.collection("ocorrencia").createIndex({ id_tipo: 1 })
    await db.collection("ocorrencia").createIndex({ id_prioridade: 1 })
    console.log("Coleção ocorrencia criada")

    await db.createCollection("solicitante", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_ocorrencia"],
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            nome: { bsonType: "string", maxLength: 255 },
            cpf_rg: { bsonType: "string", maxLength: 50 },
            idade: { bsonType: "int" },
            sexo: { bsonType: "string", maxLength: 20 },
            telefone: { bsonType: "string", maxLength: 50 },
            relacionamento: { bsonType: "string", maxLength: 100 },
            criado_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção solicitante criada")

    await db.createCollection("chamada_dispatch", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            origem: { bsonType: "string", maxLength: 150 },
            canal: { bsonType: "string", maxLength: 100 },
            dados_brutos: { bsonType: "string" },
            hora_chamada: { bsonType: "date" },
            id_registrador: { bsonType: "objectId" },
          },
        },
      },
    })
    console.log("Coleção chamada_dispatch criada")

    // ===================================================================
    // 05 - LOGÍSTICA E RECURSOS
    // ===================================================================

    await db.createCollection("tipo_vtr", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            nome: { bsonType: "string", maxLength: 100 },
            descricao: { bsonType: "string" },
          },
        },
      },
    })
    console.log("Coleção tipo_vtr criada")

    await db.createCollection("viatura", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            prefixo: { bsonType: "string", maxLength: 50 },
            placa: { bsonType: "string", maxLength: 20 },
            id_tipo_vtr: { bsonType: "objectId" },
            modelo: { bsonType: "string", maxLength: 255 },
            ano: { bsonType: "int" },
            id_unidade: { bsonType: "objectId" },
            status: { bsonType: "string", maxLength: 50 },
            hodometro_atual: { bsonType: "int" },
            ultima_manutencao: { bsonType: "date" },
            ativo: { bsonType: "bool" },
            created_at: { bsonType: "date" },
          },
        },
      },
    })
    await db.collection("viatura").createIndex({ prefixo: 1 }, { unique: true })
    await db.collection("viatura").createIndex({ placa: 1 }, { unique: true })
    console.log("Coleção viatura criada")

    await db.createCollection("deslocamento", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_ocorrencia"],
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            id_vtr: { bsonType: "objectId" },
            chamado_em: { bsonType: "date" },
            hora_saida: { bsonType: "date" },
            hora_chegada_local: { bsonType: "date" },
            hora_saida_local: { bsonType: "date" },
            hora_chegada_destino: { bsonType: "date" },
            hora_retorno_quartel: { bsonType: "date" },
            hodometro_saida: { bsonType: "int" },
            hodometro_local: { bsonType: "int" },
            distancia_km: { bsonType: "double" },
            observacoes: { bsonType: "string" },
            criado_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção deslocamento criada")

    await db.createCollection("guarnicao", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            id_vtr: { bsonType: "objectId" },
            id_usuario: { bsonType: "objectId" },
            funcao: { bsonType: "string", maxLength: 100 },
            matricula: { bsonType: "string", maxLength: 50 },
            criado_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção guarnicao criada")

    await db.createCollection("categoria_equipamento", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            nome: { bsonType: "string", maxLength: 100 },
            descricao: { bsonType: "string" },
          },
        },
      },
    })
    console.log("Coleção categoria_equipamento criada")

    await db.createCollection("equipamento", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            codigo: { bsonType: "string", maxLength: 100 },
            nome: { bsonType: "string", maxLength: 255 },
            id_categoria: { bsonType: "objectId" },
            descricao: { bsonType: "string" },
            quantidade: { bsonType: "int" },
            localizacao: { bsonType: "string", maxLength: 255 },
            criado_em: { bsonType: "date" },
          },
        },
      },
    })
    await db.collection("equipamento").createIndex({ codigo: 1 }, { unique: true })
    console.log("Coleção equipamento criada")

    await db.createCollection("inventario_equipamento", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_equipamento"],
          properties: {
            id_equipamento: { bsonType: "objectId" },
            id_vtr: { bsonType: "objectId" },
            quantidade: { bsonType: "int" },
            ultima_atualizacao: { bsonType: "date" },
          },
        },
      },
    })
    console.log("[Coleção inventario_equipamento criada")

    // ===================================================================
    // 06 - ATENDIMENTO PRÉ-HOSPITALAR (APH)
    // ===================================================================

    await db.createCollection("vitima", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_ocorrencia"],
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            nome: { bsonType: "string", maxLength: 255 },
            cpf_rg: { bsonType: "string", maxLength: 50 },
            idade: { bsonType: "int" },
            idade_unidade: {
              bsonType: "string",
              enum: ["anos", "meses"],
            },
            sexo: {
              bsonType: "string",
              enum: ["F", "M", "Outro"],
            },
            telefone: { bsonType: "string", maxLength: 50 },
            id_endereco: { bsonType: "objectId" },
            estado_consciencia: { bsonType: "string", maxLength: 100 },
            observacoes: { bsonType: "string" },
            criado_em: { bsonType: "date" },
          },
        },
      },
    })
    await db.collection("vitima").createIndex({ id_ocorrencia: 1 })
    console.log("Coleção vitima criada")

    await db.createCollection("lesao", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_vitima"],
          properties: {
            id_vitima: { bsonType: "objectId" },
            tipo_lesao: { bsonType: "string", maxLength: 150 },
            regiao_corporal: { bsonType: "string", maxLength: 150 },
            gravidade: { bsonType: "string", maxLength: 50 },
            descricao: { bsonType: "string" },
            criado_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção lesao criada")

    await db.createCollection("sinal_vital", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_vitima"],
          properties: {
            id_vitima: { bsonType: "objectId" },
            registrado_em: { bsonType: "date" },
            pa: { bsonType: "string", maxLength: 50 },
            fc: { bsonType: "int" },
            fr: { bsonType: "int" },
            sao2: { bsonType: "int" },
            glicemia: { bsonType: "double" },
            temperatura: { bsonType: "double" },
            observacoes: { bsonType: "string" },
          },
        },
      },
    })
    console.log("Coleção sinal_vital criada")

    await db.createCollection("queimadura", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_vitima"],
          properties: {
            id_vitima: { bsonType: "objectId" },
            local_corpo: { bsonType: "string", maxLength: 150 },
            grau: { bsonType: "string", maxLength: 50 },
            area_afetada: { bsonType: "string", maxLength: 50 },
            criado_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção queimadura criada")

    await db.createCollection("material_base", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            nome: { bsonType: "string", maxLength: 255 },
            descricao: { bsonType: "string" },
            unidade_medida: { bsonType: "string", maxLength: 50 },
          },
        },
      },
    })
    console.log("Coleção material_base criada")

    await db.createCollection("material_aph_utilizado", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_ocorrencia", "id_material"],
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            id_material: { bsonType: "objectId" },
            quantidade_utilizada: { bsonType: "int" },
          },
        },
      },
    })
    console.log("Coleção material_aph_utilizado criada")

    await db.createCollection("aph_atendimento", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_ocorrencia"],
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            id_vitima: { bsonType: "objectId" },
            numero_aviso: { bsonType: "string", maxLength: 100 },
            data_atendimento: { bsonType: "date" },
            sinais_iniciais: { bsonType: "object" },
            acoes_realizadas: { bsonType: "object" },
            destino: { bsonType: "string", maxLength: 255 },
            observacoes: { bsonType: "string" },
            id_preenchido_por: { bsonType: "objectId" },
            preenchido_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção aph_atendimento criada")

    // ===================================================================
    // 07 - FORMULÁRIOS SECUNDÁRIOS: INCÊNDIO
    // ===================================================================

    await db.createCollection("ocorrencia_incendio", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_ocorrencia"],
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            tipo_local: { bsonType: "string", maxLength: 150 },
            causa_presumida: { bsonType: "string", maxLength: 255 },
            tempo_extincao_minutes: { bsonType: "int" },
            tempo_rescaldo_minutes: { bsonType: "int" },
            consumo_agua_litros: { bsonType: "double" },
            area_atingida_m2: { bsonType: "double" },
            materiais_envolvidos: { bsonType: "string" },
            bens_atingidos: { bsonType: "string" },
            bens_salvos: { bsonType: "string" },
            comandante_matricula: { bsonType: "string", maxLength: 50 },
            observacoes: { bsonType: "string" },
            id_preenchido_por: { bsonType: "objectId" },
            preenchido_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção ocorrencia_incendio criada")

    // ===================================================================
    // 08 - FORMULÁRIOS SECUNDÁRIOS: SALVAMENTO
    // ===================================================================

    await db.createCollection("ocorrencia_salvamento", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_ocorrencia"],
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            tipo_operacao: { bsonType: "string", maxLength: 150 },
            local_operacao: { bsonType: "string", maxLength: 150 },
            numero_vitimas: { bsonType: "int" },
            comandante_matricula: { bsonType: "string", maxLength: 50 },
            observacoes: { bsonType: "string" },
            id_preenchido_por: { bsonType: "objectId" },
            preenchido_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção ocorrencia_salvamento criada")

    await db.createCollection("mergulhador_operacao", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_salvamento"],
          properties: {
            id_salvamento: { bsonType: "objectId" },
            matricula: { bsonType: "string", maxLength: 50 },
            nome_guerra: { bsonType: "string", maxLength: 255 },
            profundidade_m: { bsonType: "double" },
            tempo_fundo_seconds: { bsonType: "int" },
            tempo_total_seconds: { bsonType: "int" },
            cilindro_bar_inicial: { bsonType: "int" },
            cilindro_bar_final: { bsonType: "int" },
            criado_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção mergulhador_operacao criada")

    // ===================================================================
    // 09 - FORMULÁRIOS SECUNDÁRIOS: PRODUTOS PERIGOSOS
    // ===================================================================

    await db.createCollection("ocorr_produto_perigoso", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_ocorrencia"],
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            grupo: { bsonType: "string", maxLength: 150 },
            codigo_classificacao: { bsonType: "string", maxLength: 100 },
            nome_produto: { bsonType: "string", maxLength: 255 },
            numero_onu: { bsonType: "string", maxLength: 50 },
            classe_risco: { bsonType: "string", maxLength: 100 },
            tipo_recipiente: { bsonType: "string", maxLength: 100 },
            volume: { bsonType: "double" },
            unidade_volume: { bsonType: "string", maxLength: 10 },
            estado_fisico: {
              bsonType: "string",
              enum: ["Solido", "Liquido", "Gasoso", "Desconhecido"],
            },
            area_afetada: { bsonType: "object" },
            id_preenchido_por: { bsonType: "objectId" },
            preenchido_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção ocorr_produto_perigoso criada")

    await db.createCollection("pp_acao_adotada", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_produto_perigoso", "acao_nome"],
          properties: {
            id_produto_perigoso: { bsonType: "objectId" },
            acao_nome: { bsonType: "string", maxLength: 255 },
            descricao: { bsonType: "string" },
          },
        },
      },
    })
    console.log("Coleção pp_acao_adotada criada")

    // ===================================================================
    // 10 - FORMULÁRIOS SECUNDÁRIOS: PREVENÇÃO
    // ===================================================================

    await db.createCollection("ocorrencia_prevencao", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_ocorrencia"],
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            id_local_evento: { bsonType: "objectId" },
            nome_evento: { bsonType: "string", maxLength: 255 },
            hora_chegada: { bsonType: "date" },
            hora_inicio: { bsonType: "date" },
            hora_saida: { bsonType: "date" },
            evento_regularizado: { bsonType: "bool" },
            ar_av_ae_status: {
              bsonType: "string",
              enum: ["valido", "vencido", "nao_localizado", "nao_se_aplica"],
            },
            publico_presente: { bsonType: "int" },
            comandante_matricula: { bsonType: "string", maxLength: 50 },
            observacoes: { bsonType: "string" },
            id_preenchido_por: { bsonType: "objectId" },
            preenchido_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção ocorrencia_prevencao criada")

    await db.createCollection("prevencao_tipo_evento", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_prevencao", "tipo_evento"],
          properties: {
            id_prevencao: { bsonType: "objectId" },
            tipo_evento: { bsonType: "string", maxLength: 100 },
          },
        },
      },
    })
    console.log("Coleção prevencao_tipo_evento criada")

    await db.createCollection("prevencao_estrutura", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_prevencao", "estrutura_nome"],
          properties: {
            id_prevencao: { bsonType: "objectId" },
            estrutura_nome: { bsonType: "string", maxLength: 100 },
            montada: { bsonType: "bool" },
          },
        },
      },
    })
    console.log("Coleção prevencao_estrutura criada")

    // ===================================================================
    // 11 - FORMULÁRIOS SECUNDÁRIOS: ATITUDE COMUNITÁRIA
    // ===================================================================

    await db.createCollection("ocorrencia_atitude_com", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_ocorrencia"],
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            tipo_atividade: { bsonType: "string", maxLength: 150 },
            publico_alvo: { bsonType: "string", maxLength: 150 },
            participantes: { bsonType: "int" },
            resultado: { bsonType: "string" },
            id_preenchido_por: { bsonType: "objectId" },
            preenchido_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção ocorrencia_atitude_com criada")

    await db.createCollection("ac_interacao_social", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_atitude", "acao_nome"],
          properties: {
            id_atitude: { bsonType: "objectId" },
            acao_nome: { bsonType: "string", maxLength: 100 },
          },
        },
      },
    })
    console.log("Coleção ac_interacao_social criada")

    await db.createCollection("ac_apoio_instituicao", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_atitude", "instituicao_nome"],
          properties: {
            id_atitude: { bsonType: "objectId" },
            instituicao_nome: { bsonType: "string", maxLength: 100 },
          },
        },
      },
    })
    console.log("Coleção ac_apoio_instituicao criada")

    // ===================================================================
    // 12 - ANEXOS, ARQUIVOS E MÍDIA
    // ===================================================================

    await db.createCollection("formulario", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_ocorrencia", "tipo_formulario"],
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            tipo_formulario: { bsonType: "string", maxLength: 100 },
            dados: { bsonType: "object" },
            id_preenchido_por: { bsonType: "objectId" },
            preenchido_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção formulario criada")

    await db.createCollection("arquivo", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            id_formulario: { bsonType: "objectId" },
            nome_original: { bsonType: "string", maxLength: 255 },
            caminho: { bsonType: "string", maxLength: 1024 },
            tipo_mime: { bsonType: "string", maxLength: 100 },
            tamanho_bytes: { bsonType: "long" },
            enviado_por: { bsonType: "objectId" },
            enviado_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção arquivo criada")

    // ===================================================================
    // 13 - AUDITORIA E LOGS
    // ===================================================================

    await db.createCollection("auditoria_log", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            data_hora: { bsonType: "date" },
            id_usuario: { bsonType: "objectId" },
            usuario_nome: { bsonType: "string", maxLength: 255 },
            acao_tipo: { bsonType: "string", maxLength: 100 },
            modulo: { bsonType: "string", maxLength: 100 },
            recurso_tabela: { bsonType: "string", maxLength: 100 },
            recurso_id: { bsonType: "string", maxLength: 100 },
            descricao: { bsonType: "string" },
            dados_anteriores: { bsonType: "object" },
            dados_posteriores: { bsonType: "object" },
          },
        },
      },
    })
    console.log("Coleção auditoria_log criada")

    await db.createCollection("acesso_log", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            id_usuario: { bsonType: "objectId" },
            ip: { bsonType: "string", maxLength: 50 },
            user_agent: { bsonType: "string" },
            data_hora: { bsonType: "date" },
            sucesso: { bsonType: "bool" },
          },
        },
      },
    })
    console.log("Coleção acesso_log criada")

    // ===================================================================
    // 14 - APOIOS EXTERNOS E DIVERSOS
    // ===================================================================

    await db.createCollection("agencia_apoio", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            nome: { bsonType: "string", maxLength: 255 },
            tipo: { bsonType: "string", maxLength: 100 },
            contato: { bsonType: "string", maxLength: 255 },
            telefone: { bsonType: "string", maxLength: 50 },
            email: { bsonType: "string", maxLength: 120 },
          },
        },
      },
    })
    console.log("Coleção agencia_apoio criada")

    await db.createCollection("ocorrencia_agencia", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_ocorrencia"],
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            id_agencia: { bsonType: "objectId" },
            descricao: { bsonType: "string" },
            acionado: { bsonType: "bool" },
            horario_acionamento: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção ocorrencia_agencia criada")

    await db.createCollection("tarefa", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            titulo: { bsonType: "string", maxLength: 255 },
            descricao: { bsonType: "string" },
            responsavel: { bsonType: "objectId" },
            status: { bsonType: "string", maxLength: 50 },
            data_vencimento: { bsonType: "date" },
            criado_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção tarefa criada")

    await db.createCollection("mensagem", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            id_remetente: { bsonType: "objectId" },
            conteudo: { bsonType: "string" },
            enviado_em: { bsonType: "date" },
            lida: { bsonType: "bool" },
          },
        },
      },
    })
    console.log("Coleção mensagem criada")

    // ===================================================================
    // 15 - GPS E RASTREAMENTO
    // ===================================================================

    await db.createCollection("gps_viatura", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_vtr", "latitude", "longitude"],
          properties: {
            id_vtr: { bsonType: "objectId" },
            latitude: { bsonType: "double" },
            longitude: { bsonType: "double" },
            velocidade: { bsonType: "double" },
            direcao: { bsonType: "string", maxLength: 50 },
            registrado_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção gps_viatura criada")

    await db.createCollection("gps_ocorrencia", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_ocorrencia", "latitude", "longitude"],
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            latitude: { bsonType: "double" },
            longitude: { bsonType: "double" },
            precisao_metros: { bsonType: "double" },
            coletado_por: { bsonType: "objectId" },
            coletado_em: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção gps_ocorrencia criada")

    await db.createCollection("midia_ocorrencia", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_ocorrencia", "tipo", "caminho_arquivo"],
          properties: {
            id_ocorrencia: { bsonType: "objectId" },
            tipo: {
              bsonType: "string",
              enum: ["foto", "video"],
            },
            caminho_arquivo: { bsonType: "string", maxLength: 1024 },
            latitude: { bsonType: "double" },
            longitude: { bsonType: "double" },
            capturado_por: { bsonType: "objectId" },
            capturado_em: { bsonType: "date" },
            descricao: { bsonType: "string" },
          },
        },
      },
    })
    console.log("Coleção midia_ocorrencia criada")

    await db.createCollection("assinatura_digital", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["id_usuario", "hash_documento"],
          properties: {
            id_usuario: { bsonType: "objectId" },
            id_ocorrencia: { bsonType: "objectId" },
            id_formulario: { bsonType: "objectId" },
            hash_documento: { bsonType: "string", maxLength: 512 },
            assinatura_base64: { bsonType: "string" },
            certificado_digital: { bsonType: "string", maxLength: 255 },
            ip_assinatura: { bsonType: "string", maxLength: 50 },
            data_assinatura: { bsonType: "date" },
          },
        },
      },
    })
    console.log("Coleção assinatura_digital criada")

    console.log("Esquema MongoDB criado com sucesso!✅")
    console.log("Total de coleções criadas: 50+")
  } catch (error) {
    console.error("Erro ao criar esquema:", error)
    throw error
  } finally {
    await client.close()
    console.log("Conexão fechada")
  }
}

// Executar a criação do esquema
createSchema().catch(console.error)
