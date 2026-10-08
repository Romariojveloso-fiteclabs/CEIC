import { DocenteManualStep } from '../types/course';

export const docenteManualStepsData: DocenteManualStep[] = [
  {
    stepNumber: 1,
    title: 'Cadastro e Acesso ao SIGAA da UFPE',
    instruction: 'Os docentes da iniciativa privada aprovados pela coordenação devem realizar a autenticação inicial no sistema acadêmico oficial.',
    details: [
      'Acesse o endereço oficial do sistema: https://sigaa.ufpe.br/sigaa/',
      'Insira suas credenciais cadastradas (Usuário e Senha).',
      'Confirme se o vínculo docente está associado ao curso de especialização do CEIC sob tutela do Departamento de Eletrônica e Sistemas (DES).',
    ],
    screenshots: [
      {
        url: 'https://ceic.tec.br/wp-content/uploads/2026/09/Docente1-1024x595.png',
        caption: 'Tela inicial de autenticação no sistema acadêmico SIGAA da UFPE.',
      },
    ],
    actionLinks: [
      { label: 'Acessar SIGAA UFPE', url: 'https://sigaa.ufpe.br/sigaa/' },
    ],
  },
  {
    stepNumber: 2,
    title: 'Criação do E-mail Institucional @ufpe.br',
    instruction: 'Ativação da identidade digital institucional e vinculação à suíte de ferramentas acadêmicas da universidade.',
    details: [
      'Acesse o portal https://id.ufpe.br e selecione a opção "Solicitar Acesso".',
      'Defina uma senha robusta contendo entre 8 e 64 caracteres com maiúscula, minúscula, número e símbolo especial permitido.',
      'O e-mail @ufpe.br opera integrado aos serviços Google Workspace (Gmail, Classroom, Drive e Meet).',
      'Caso surja alguma inconsistência no login, abra um chamado no portal OTRS da STI informando a unidade Departamento de Eletrônica e Sistemas (DES/CTG) ou ligue para a central: +55 (81) 2126-7777.',
    ],
    screenshots: [
      {
        url: 'https://ceic.tec.br/wp-content/uploads/2026/09/Docente2-1024x673.png',
        caption: 'Portal ID UFPE: Solicitação de acesso e regras de composição de senha.',
      },
      {
        url: 'https://ceic.tec.br/wp-content/uploads/2026/09/Docente3-1024x556.png',
        caption: 'Painel de confirmação de cadastro de identidade institucional.',
      },
    ],
    actionLinks: [
      { label: 'Portal ID UFPE', url: 'https://id.ufpe.br' },
      { label: 'Central de Serviços de TIC (OTRS)', url: 'https://otrs.ufpe.br/otrs/customer.pl' },
    ],
  },
  {
    stepNumber: 3,
    title: 'Cadastro de Avaliações no Portal do Docente',
    instruction: 'Agendamento formal das datas de entrega de artefatos, relatórios ou apresentações no sistema.',
    details: [
      'Após o login no SIGAA, acesse o "Portal do Docente" e selecione a disciplina atribuída.',
      'Na guia "Atividades", clique na opção "Avaliações".',
      'Selecione a ação "Cadastrar Data de Avaliação" e insira a data limite correspondente ao último dia de atividades da matéria.',
      'Caso utilize metodologia de sala de aula invertida, registre e grave a cerimônia online como prova material da avaliação discente.',
    ],
    screenshots: [
      {
        url: 'https://ceic.tec.br/wp-content/uploads/2026/09/Docente6-1024x736.png',
        caption: 'Acesso ao Portal do Docente e seleção da turma atribuída.',
      },
      {
        url: 'https://ceic.tec.br/wp-content/uploads/2026/09/Docente8-1024x531.png',
        caption: 'Guia Atividades e módulo de cadastro de datas de avaliação.',
      },
      {
        url: 'https://ceic.tec.br/wp-content/uploads/2026/09/Docente9-1024x516.png',
        caption: 'Formulário de preenchimento da data final e critérios avaliativos.',
      },
    ],
  },
  {
    stepNumber: 4,
    title: 'Cadastro de Tópicos de Aula e Plano de Ensino',
    instruction: 'Estruturação do cronograma e ementa detalhada ministrada durante os encontros.',
    details: [
      'Na guia "Turma", selecione a opção "Tópicos de Aula" e clique em "Criar Tópico de Aula".',
      'No campo "Data Inicial", selecione o primeiro dia de atividades da sua disciplina.',
      'No campo "Data Final", selecione o último dia letivo da disciplina.',
      'Preencha com exatidão os campos "Descrição" e "Conteúdo" detalhando os laboratórios e fundamentos teóricos.',
      'Clique no botão "Cadastrar" para confirmar a gravação dos tópicos.',
    ],
    screenshots: [
      {
        url: 'https://ceic.tec.br/wp-content/uploads/2026/09/Docente10-1024x550.png',
        caption: 'Navegação para a aba Turma e abertura do gerenciador de tópicos.',
      },
      {
        url: 'https://ceic.tec.br/wp-content/uploads/2026/09/Docente12-1024x571.png',
        caption: 'Configuração do intervalo de datas e preenchimento de conteúdo programático.',
      },
      {
        url: 'https://ceic.tec.br/wp-content/uploads/2026/09/Docente13-1024x556.png',
        caption: 'Tela de confirmação do cadastro com sucesso.',
      },
    ],
  },
  {
    stepNumber: 5,
    title: 'Lançamento de Frequência e Presença',
    instruction: 'Apuração e inserção das presenças e faltas da turma nas chamadas síncronas e presenciais.',
    details: [
      'Na guia "Alunos", selecione a opção "Lançar Frequência".',
      'Clique no ícone de calendário correspondente aos dias em que as aulas foram ministradas.',
      'Marque individualmente a assiduidade dos matriculados e confirme a gravação.',
    ],
    screenshots: [
      {
        url: 'https://ceic.tec.br/wp-content/uploads/2026/09/Docente14-1024x548.png',
        caption: 'Acesso à opção Lançar Frequência na guia Alunos.',
      },
      {
        url: 'https://ceic.tec.br/wp-content/uploads/2026/09/Docente15-1024x435.png',
        caption: 'Seleção das datas no calendário letivo da turma.',
      },
      {
        url: 'https://ceic.tec.br/wp-content/uploads/2026/09/Docente16-1024x480.png',
        caption: 'Planilha de marcação de presença e faltas no SIGAA.',
      },
    ],
    importantNotice: 'Atenção fundamental: o lançamento de faltas deve ser concluído impreterivelmente antes do lançamento de notas.',
  },
  {
    stepNumber: 6,
    title: 'Lançamento de Notas e Consolidação da Turma',
    instruction: 'Inserção das médias finais dos alunos e fechamento irreversível da disciplina.',
    details: [
      'Na guia "Alunos", selecione a opção "Lançar Notas".',
      'Insira as notas de 0,0 a 10,0 para cada participante. Alunos sem comparecimento ou entrega devem receber a nota 0,0.',
      'Revise com máxima atenção todas as pontuações e a lista de presenças antes de submeter.',
      'Após a conferência, clique no comando de "Consolidar Turma". A consolidação no SIGAA é definitiva.',
    ],
    screenshots: [
      {
        url: 'https://ceic.tec.br/wp-content/uploads/2026/09/Docente17-1024x543.png',
        caption: 'Interface de lançamento de notas finais na plataforma acadêmica.',
      },
      {
        url: 'https://ceic.tec.br/wp-content/uploads/2026/09/Docente18-1024x748.png',
        caption: 'Validação da planilha de notas dos estudantes.',
      },
      {
        url: 'https://ceic.tec.br/wp-content/uploads/2026/09/Docente19-1024x694.png',
        caption: 'Confirmação e fechamento definitivo da disciplina (Consolidação).',
      },
    ],
    importantNotice: 'O sistema SIGAA não permite a edição de faltas após a consolidação das notas. Respeite estritamente a ordem operacional.',
  },
  {
    stepNumber: 7,
    title: 'Recebimento de Proventos e Modelos Administrativos',
    instruction: 'Preenchimento e envio formal dos formulários de remuneração docente ao coordenador acadêmico.',
    details: [
      'Formulário de Solicitação de Pagamento: deve ser preenchido com os dados bancários e disciplinares do docente (interno ou externo). Baixe o modelo oficial e salve o arquivo gerado em PDF.',
      'Declaração de Múltiplos Vínculos: obrigatória para profissionais externos que já recolhem teto previdenciário (INSS) por outra instituição privada.',
      'Ambos os documentos devem ser assinados eletronicamente via Gov.br e encaminhados por e-mail ao Coordenador Geral Prof. Dr. Sidney Lima no endereço sidney.lima@ufpe.br.',
    ],
    actionLinks: [
      {
        label: 'Baixar Modelo: Solicitação de Pagamento (Planilha)',
        url: 'https://docs.google.com/spreadsheets/d/1iviMwhuWFYjZ5nHXHeC-Rz9Gail05l-Y/edit?usp=sharing',
        isDownload: true,
      },
      {
        label: 'Baixar Modelo: Declaração de Múltiplos Vínculos (Docs)',
        url: 'https://docs.google.com/document/d/1aUgbe8fkErKq7l_l7XhFAwxg4XS8_raJ/edit?usp=sharing',
        isDownload: true,
      },
    ],
    importantNotice: 'Encaminhe os PDFs com assinatura digital Gov.br para o e-mail: sidney.lima@ufpe.br.',
  },
];
