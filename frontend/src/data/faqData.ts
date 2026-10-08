import { FaqItem } from '../types/course';
import { Language } from '../i18n/translations';

export const localizedFaqData: Record<Language, FaqItem[]> = {
  pt: [
    {
      category: 'sigaa',
      question: 'Esqueceu a senha do SIGAA e do e-mail institucional?',
      answer: 'Caso tenha dificuldades de login no SIGAA, acerte a redefinição utilizando o seu e-mail pessoal cadastrado na inscrição (e não o institucional @ufpe.br) através do link https://sigadmin.ufpe.br/admin/public/recuperar_senha.jsf. Para o e-mail institucional (@ufpe.br no Gmail), utilize a opção "Recuperar Senha" em https://id.ufpe.br. Recomendamos evitar senhas complexas geradas aleatoriamente por extensões que possam falhar em caracteres reservados. Se a inconsistência persistir, abra chamado na Central de Serviços STI informando como unidade solicitante o Departamento de Eletrônica e Sistemas (DES/CTG) ou telefone para (81) 2126-7777.',
      highlight: 'Central de Suporte STI: (81) 2126-7777',
    },
    {
      category: 'certificacao',
      question: 'O certificado de conclusão de Pós-Graduação é emitido pela Universidade Federal de Pernambuco (UFPE)?',
      answer: 'Sim. Todos os certificados das pós-graduações vinculadas ao CEIC são emitidos e registrados oficialmente pela Universidade Federal de Pernambuco (UFPE). A UFPE é classificada como a principal universidade do Norte/Nordeste em renomados índices acadêmicos (RUF, Times Higher Education e QS World University Rankings). O documento confere validade integral de especialista em todo o território nacional.',
      highlight: 'Certificação Oficial UFPE',
    },
    {
      category: 'metodologia',
      question: 'O que é uma Pós-Graduação Lato Sensu do tipo residência?',
      answer: 'As pós-graduações vinculadas ao CEIC combinam 360 horas de carga teórica estruturada e 120 horas de práticas aplicadas e simulações em regime de residência tecnológica. Nesse período, os discentes desenvolvem artefatos tangíveis de mercado, relatórios de exploração/defesa e projetos de inovação que culminam na elaboração e no depósito de pedidos de patente junto aos órgãos competentes.',
      highlight: '360h Teóricas + 120h Práticas + Patentes',
    },
    {
      category: 'matricula',
      question: 'É possível apresentar o diploma de graduação após o início das aulas?',
      answer: 'Sim. Para efetivação da matrícula inicial, é suficiente apresentar a certidão ou declaração oficial de conclusão e colação de grau emitida pela instituição de ensino superior de origem. O diploma físico ou digital definitivo deverá ser anexado ao longo do curso antes da expedição do certificado final de especialista.',
      highlight: 'Declaração provisória aceita na matrícula',
    },
    {
      category: 'matricula',
      question: 'Quais seriam as possíveis contestações ou inconsistências no diploma de graduação?',
      answer: 'A coordenação e a Pró-Reitoria conferem se a grafia do nome na assinatura digital do Gov.br confere rigorosamente com os documentos de identificação e o diploma. Divergências decorrentes de casamento, divórcio ou redesignação de nome devem ser acompanhadas da certidão averbada. Além disso, verifica-se a portaria de reconhecimento do curso no Diário Oficial da União (DOU) ou o código de autenticidade eletrônica do diploma.',
      highlight: 'Conferência documental e DOU',
    },
    {
      category: 'academico',
      question: 'Tenho a liberdade de escolher entre assistir às aulas presencialmente ou acompanhar online?',
      answer: 'Sim. A presença física em sala é totalmente opcional. Oferecemos um espaço físico completo, refrigerado e equipado na Avenida República do Líbano, 251, Torre A, sala 1501, Pina, Recife/PE (CEP: 51110-160), ideal para discentes que buscam ambiente focado de estudos e conectividade de alta velocidade, além de transmissão síncrona online com suporte interativo.',
      highlight: 'Formato Híbrido com Polo no Pina (Recife)',
    },
    {
      category: 'metodologia',
      question: 'O curso é totalmente assíncrono ou é necessário participar das aulas em tempo real?',
      answer: 'O curso opera com aulas síncronas (ao vivo e online), onde os professores realizam a chamada de frequência em cada encontro. No último encontro de cada disciplina adota-se a metodologia de sala de aula invertida, com apresentação de experimentos práticos e relatórios técnicos. Por isso, a participação nas transmissões em tempo real é requerida para aproveitamento pleno.',
      highlight: 'Aulas síncronas e sala de aula invertida',
    },
    {
      category: 'metodologia',
      question: 'As aulas ficam gravadas para revisão posterior?',
      answer: 'Sim. Cada aluno matriculado recebe sua conta Google institucional no domínio @ufpe.br e é integrado ao Google Classroom das disciplinas. As transmissões são arquivadas na íntegra e ficam acessíveis durante todo o período letivo para consultas, revisões de laboratórios e aprofundamento.',
      highlight: 'Google Classroom com gravações em alta definição',
    },
    {
      category: 'certificacao',
      question: 'O curso é reconhecido pelo MEC? Por que não consta como curso individual no e-MEC?',
      answer: 'Conforme a Resolução nº 1 de 6 de abril de 2018 da Câmara de Educação Superior do Conselho Nacional de Educação (CNE/MEC), universidades credenciadas como a UFPE possuem autonomia universitária plena para criar, ministrar e certificar cursos de pós-graduação Lato Sensu em suas áreas de competência sem necessidade de autorização prévia caso a caso no e-MEC.',
      highlight: 'Autonomia Universitária plena (Resolução CNE/MEC nº 1/2018)',
    },
    {
      category: 'academico',
      question: 'É preciso ser um exímio programador para acompanhar os experimentos práticos?',
      answer: 'Não. O corpo docente adota uma metodologia multidisciplinar e inclusiva. O programa atende tanto profissionais técnicos experientes quanto graduados em Direito, Administração, Perícia Criminal, Engenharia e Gestão que buscam especialização sólida em cibersegurança. Há trilhas que cobrem aspectos normativos, LGPD, gestão de crises e governança ao lado dos laboratórios técnicos assistidos.',
      highlight: 'Multidisciplinar e estruturado para diferentes perfis',
    },
  ],
  en: [
    {
      category: 'sigaa',
      question: 'Forgot your SIGAA password or institutional email credentials?',
      answer: 'To reset your SIGAA access, use your personal email provided during application at https://sigadmin.ufpe.br/admin/public/recuperar_senha.jsf. For your @ufpe.br Google Workspace account, use "Recover Password" at https://id.ufpe.br. If problems persist, contact the IT Service Center (STI) at (81) 2126-7777 referencing Department of Electronics and Systems (DES/CTG).',
    },
    {
      category: 'certificacao',
      question: 'Is the postgraduate certificate officially issued by Universidade Federal de Pernambuco (UFPE)?',
      answer: 'Yes. All postgraduate certificates are officially issued and registered by UFPE, consistently ranked as the top university in Northern/Northeastern Brazil (RUF, Times Higher Education, QS World Rankings), carrying full nationwide accreditation.',
    },
    {
      category: 'metodologia',
      question: 'What is a residency-style Lato Sensu postgraduate program?',
      answer: 'The program pairs 360 hours of foundational theory with 120 hours of hands-on technological residency drills and capstone deliverables, concluding with formal patent filings and production-grade prototypes.',
    },
    {
      category: 'matricula',
      question: 'Can I present my undergraduate diploma after classes have started?',
      answer: 'Yes. An official certificate of course completion or graduation statement from your higher education institution is sufficient for initial registration. The final degree must be submitted before certificate issuance.',
    },
    {
      category: 'matricula',
      question: 'What might cause verification issues with my degree documents?',
      answer: 'The coordination verifies that applicant names on official IDs match the Gov.br digital signature and diploma. Name changes due to marriage or legal updates require the respective official certificate.',
    },
    {
      category: 'academico',
      question: 'Can I choose between in-person attendance and remote online participation?',
      answer: 'Yes. Physical classroom attendance is optional. We host a high-tech facility at Av. República do Líbano 251, Tower A, suite 1501, Pina, Recife/PE for those seeking an equipped environment, with full synchronous online streaming.',
    },
    {
      category: 'metodologia',
      question: 'Is the curriculum asynchronous or is real-time participation required?',
      answer: 'Classes are live and interactive, with roll call conducted in each session. The final class of each module employs the flipped classroom format with hands-on lab demonstrations.',
    },
    {
      category: 'metodologia',
      question: 'Are sessions recorded for later review?',
      answer: 'Yes. Enrolled students receive @ufpe.br Google Workspace accounts with complete access to recorded classes and materials in Google Classroom.',
    },
    {
      category: 'certificacao',
      question: 'Is the program accredited under Ministry of Education (MEC) guidelines?',
      answer: 'Under Federal Resolution No. 1 (April 6, 2018), accredited public universities like UFPE possess full legal autonomy to offer and certify Lato Sensu postgraduate programs.',
    },
    {
      category: 'academico',
      question: 'Do I need to be an expert programmer to succeed in practical labs?',
      answer: 'No. The program welcomes multidisciplinary profiles including law, management, forensics, and engineering professionals, with guided laboratory support.',
    },
  ],
  es: [
    {
      category: 'sigaa',
      question: '¿Olvidó su contraseña de SIGAA o del correo institucional @ufpe.br?',
      answer: 'Para restablecer el acceso a SIGAA, use su correo personal en https://sigadmin.ufpe.br/admin/public/recuperar_senha.jsf. Para el correo institucional, use https://id.ufpe.br. Soporte telefónico STI: (81) 2126-7777.',
    },
    {
      category: 'certificacao',
      question: '¿El certificado es emitido por la Universidade Federal de Pernambuco (UFPE)?',
      answer: 'Sí. Todos los certificados son emitidos y registrados formalmente por la UFPE, primera universidad del Norte/Nordeste brasileño en rankings internacionales.',
    },
    {
      category: 'metodologia',
      question: '¿En qué consiste el modelo de posgrado tipo residencia?',
      answer: 'Combina 360 horas de formación teórica con 120 horas de residencia tecnológica práctica, concluyendo con depósitos de patentes y prototipos.',
    },
    {
      category: 'matricula',
      question: '¿Puedo presentar el título de grado tras el inicio del curso?',
      answer: 'Sí. Una constancia o certificado oficial de culminación de estudios es suficiente para iniciar el curso.',
    },
    {
      category: 'matricula',
      question: '¿Qué inconsistencias documentales pueden ocurrir?',
      answer: 'Se verifica la concordancia de nombre con la firma digital y el diploma superior, requiriendo actas en casos de cambio de estado civil.',
    },
    {
      category: 'academico',
      question: '¿Puedo elegir entre clases presenciales y seguimiento online?',
      answer: 'Sí, la asistencia presencial es opcional. Disponemos de instalaciones equipadas en Pina, Recife/PE, además de transmisión síncrona.',
    },
    {
      category: 'metodologia',
      question: '¿El curso es asíncrono o exige participación en tiempo real?',
      answer: 'Las clases son síncronas en vivo, con llamado a lista y metodología de aula invertida en el cierre de cada materia.',
    },
    {
      category: 'metodologia',
      question: '¿Las clases quedan grabadas?',
      answer: 'Sí. Todas las clases se graban y se alojan en Google Classroom para consulta permanente de los alumnos.',
    },
    {
      category: 'certificacao',
      question: '¿El curso cuenta con reconocimiento oficial del MEC?',
      answer: 'La Resolución CNE/MEC nº 1/2018 otorga plena autonomía a la UFPE para ofrecer y certificar programas de posgrado Lato Sensu.',
    },
    {
      category: 'academico',
      question: '¿Es obligatorio ser programador experto para los laboratorios?',
      answer: 'No. El programa acoge perfiles multidisciplinarios de derecho, gestión, forense e ingeniería con orientación asistida.',
    },
  ],
};
