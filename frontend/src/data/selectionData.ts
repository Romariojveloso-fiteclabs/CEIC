import { SelectionStep } from '../types/course';

export const selectionStepsData: SelectionStep[] = [
  {
    stepNumber: 1,
    title: 'Esclarecimentos sobre a Residência e Modelo Financeiro',
    summary: 'Alinhamento transparente de expectativas: o programa adota o modelo de Residência Tecnológica e de autogestão financeira.',
    details: [
      'Diferente de cursos subvencionados por emendas que cobrem integralmente as despesas, os cursos de especialização do CEIC operam sob regime de autogestão financeira com infraestrutura própria de residência.',
      'Para submissão da candidatura no processo seletivo, é necessário o recolhimento da taxa de inscrição no valor de R$ 100,00 (cem reais), destinada à cobertura dos custos de análise documental e triagem das candidaturas.',
      'O comprovante de pagamento da taxa é documento obrigatório a ser anexado junto à documentação no sistema oficial.',
    ],
    tips: [
      'Em caso de dúvidas prévias sobre organização ou turmas, utilize o WhatsApp empresarial: (81) 98321-7076.',
      'Acompanhe regularmente o portal público do SIGAA UFPE para atualizações de editais.',
    ],
    warning: 'O valor da taxa de inscrição destina-se aos custos operacionais e não é reembolsável em caso de desistência ou não prosseguimento.',
    actionUrl: 'https://sigaa.ufpe.br/sigaa/public/curso/lista.jsf?nivel=L&aba=p-lato',
    actionLabel: 'Consultar Cursos Lato Sensu no SIGAA',
  },
  {
    stepNumber: 2,
    title: 'Investimento e Documentação Exigida',
    summary: 'Separação dos arquivos comprobatórios obrigatórios e recolhimento da taxa de inscrição via Pix.',
    details: [
      'RG oficial com emissão regular (frente e verso legíveis).',
      'CPF (frente e verso, caso não conste no documento de identificação).',
      'Comprovante de residência atualizado (emitido nos últimos 90 dias).',
      'Diploma de graduação reconhecido (frente e verso) ou certidão oficial de colação de grau.',
      'Comprovante de pagamento da taxa de inscrição (R$ 100,00 via Pix).',
    ],
    tips: [
      'Pagamento da taxa via C6 Pix no link direto ou apontando a câmera para o QR Code oficial.',
      'Consulte a coordenação pelo WhatsApp (81) 98321-7076 para informações de condições de pagamento das mensalidades.',
    ],
    imageUrl: 'https://ceic.tec.br/wp-content/uploads/2025/12/PixInscricaoCEIC.png',
    actionUrl: 'https://cobranca.c6pix.com.br/01KDN5VWSGEH2GMYG43C7AG3TX',
    actionLabel: 'Acessar Link de Cobrança C6 Pix (R$ 100,00)',
  },
  {
    stepNumber: 3,
    title: 'Inscrição no Sistema SIGAA da UFPE',
    summary: 'Autenticação com conta Gov.br / SOU GOV e preenchimento da inscrição no edital correspondente.',
    details: [
      'Acesse a plataforma Gov.br para certificar-se de que sua conta nacional está ativa.',
      'Acesse a página pública do SIGAA UFPE e selecione a seção "Lato Sensu".',
      'Clique em "Processos Seletivos" e localize o edital da Pós-Graduação vinculada ao CEIC.',
      'Preencha o formulário eletrônico e anexe os arquivos em formato PDF.',
    ],
    tips: [
      'Utilize exatamente as mesmas informações de grafia do seu documento oficial para evitar divergências.',
    ],
    imageUrl: 'https://ceic.tec.br/wp-content/uploads/2026/09/Selecao1-1024x672.png',
    actionUrl: 'https://sigaa.ufpe.br/sigaa/public',
    actionLabel: 'Acessar Portal Público SIGAA UFPE',
  },
  {
    stepNumber: 4,
    title: 'Acompanhamento do Deferimento',
    summary: 'Monitoramento da homologação da documentação pela comissão de seleção do curso.',
    details: [
      'A coordenação analisa os diplomas e comprovantes anexados para verificar a autenticidade e validade perante o MEC.',
      'O candidato pode verificar o status de sua inscrição diretamente na área do candidato.',
      'Caso surja alguma advertência transitória no sistema, mantenha a tranquilidade: a equipe de suporte entra em contato caso falte algum anexo.',
    ],
    imageUrl: 'https://ceic.tec.br/wp-content/uploads/2025/12/Captura-de-tela-2025-12-28-115018.png',
  },
  {
    stepNumber: 5,
    title: 'Contato Institucional e Termo SuperSign',
    summary: 'Formalização eletrônica do acordo financeiro com assinatura digital segura.',
    details: [
      'Após o deferimento, o candidato é contatado pelo WhatsApp institucional +55 (81) 98321-7076.',
      'Nesta etapa são apresentadas as orientações de início e calendário letivo.',
      'O selecionado recebe o termo de acordo financeiro emitido pelo CEIC para assinatura eletrônica através da plataforma SuperSign.',
    ],
    tips: [
      'Mantenha seu número de WhatsApp informado na inscrição ativo e acessível.',
    ],
  },
  {
    stepNumber: 6,
    title: 'Efetivação da Matrícula Discente',
    summary: 'Cadastro do discente no portal acadêmico do SIGAA e recebimento do número de matrícula.',
    details: [
      'Os candidatos aprovados acessam o endereço oficial https://sigaa.ufpe.br/sigaa/.',
      'Na área de acesso, selecione a opção "Aluno: Cadastre-se".',
      'Insira os mesmos dados cadastrais validados na etapa de inscrição.',
      'O número de matrícula discente individual é transmitido pela coordenação para ativação do registro acadêmico.',
    ],
    actionUrl: 'https://sigaa.ufpe.br/sigaa/',
    actionLabel: 'Acessar Portal de Matrícula SIGAA',
  },
  {
    stepNumber: 7,
    title: 'Criação do E-mail Institucional @ufpe.br',
    summary: 'Ativação do e-mail com domínio oficial da UFPE e acesso ao Google Workspace (Gmail, Classroom, Drive).',
    details: [
      'Acesse https://id.ufpe.br e clique na opção "Solicitar Acesso".',
      'A senha deve conter entre 8 e 64 caracteres, incluindo maiúscula, minúscula, dígito e caractere especial, evitando repetições ou datas pessoais.',
      'O e-mail @ufpe.br concede acesso ao Google Classroom onde ocorrem as publicações de gravações e materiais de aula.',
      'Caso ocorra lentidão na propagação da conta, aguarde até 24 horas úteis ou contate a Central de Serviços STI no telefone (81) 2126-7777.',
    ],
    tips: [
      'Em chamados no OTRS da STI, a unidade solicitante indicada deve ser o Departamento de Eletrônica e Sistemas (DES/CTG).',
    ],
    imageUrl: 'https://ceic.tec.br/wp-content/uploads/2026/09/Selecao7-1024x673.png',
    actionUrl: 'https://id.ufpe.br',
    actionLabel: 'Acessar Portal ID UFPE',
  },
  {
    stepNumber: 8,
    title: 'Declaração de Vínculo e Benefícios Estudantis',
    summary: 'Emissão do comprovante de matrícula ativo no SIGAA e solicitação de carteira estudantil digital.',
    details: [
      'No menu do SIGAA, aba "Ensino", selecione "Emitir Declaração de Vínculo" com código de autenticidade eletrônica.',
      'Com o comprovante em mãos, o aluno de pós-graduação pode emitir sua carteira estudantil oficial para fruição de meia-entrada em eventos culturais, cinemas e transportes.',
      'É possível realizar a emissão online da carteira estudantil digital de forma ágil através do aplicativo parceiro PagMeia.',
    ],
    actionUrl: 'https://www.pagmeia.com.br/',
    actionLabel: 'Acessar Aplicativo PagMeia',
  },
];
