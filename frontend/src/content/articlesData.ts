import { MarkdownArticle } from '../types/content';

export const articlesData: MarkdownArticle[] = [
  {
    frontmatter: {
      title: 'Desenvolvimento de Mecanismos de Antivírus Heurístico com Aprendizado Profundo',
      slug: 'antivirus-heuristico-deep-learning',
      description: 'Como arquitetar classificadores neurais para inspeção de cabeçalhos PE/ELF e detecção pré-execução de malwares com baixa taxa de falsos positivos.',
      author: 'Dr. Leonardo Vasconcelos',
      authorRole: 'Doutor em Inteligência Artificial e Pesquisador do CEIC',
      pubDate: '2025-08-14',
      category: 'ia-defensiva',
      categoryLabel: 'IA Defensiva',
      readTime: '9 min de leitura',
      tags: ['Machine Learning', 'Malware Analysis', 'PE Header', 'YARA', 'Blue Team'],
      featured: true,
    },
    excerpt: 'A transição dos motores antivírus baseados em assinaturas estáticas para classificadores baseados em redes neurais convolucionais (CNNs) e gradient boosted trees representa o estado da arte na proteção de endpoints.',
    rawMarkdown: `---
title: "Desenvolvimento de Mecanismos de Antivírus Heurístico com Aprendizado Profundo"
slug: "antivirus-heuristico-deep-learning"
author: "Dr. Leonardo Vasconcelos"
role: "Pesquisador de IA Defensiva - CEIC"
pubDate: "2025-08-14"
category: "ia-defensiva"
readTime: "9 min"
tags: ["Machine Learning", "Malware Analysis", "PE Header", "YARA"]
---

# Desenvolvimento de Mecanismos de Antivírus Heurístico com Aprendizado Profundo

A proliferação de campanhas de malware polimórfico e ataques direcionados (APTs) esgotou a eficácia dos motores defensivos estritamente orientados a assinaturas hash (MD5, SHA-256). No **Centro de Excelência em Inteligência Cibernética (CEIC)**, os pesquisadores e pós-graduandos investigam a concepção de motores antivírus híbridos fundamentados em representações estatísticas e extração vetorial de metadados binários.

## 1. O Problema das Assinaturas Estáticas e Técnicas de Evasão

Criptografadores (crypters) comerciais e packers sob encomenda alteram a entropia e as seções de arquivos executáveis (PE32/PE32+) sem modificar a carga útil funcional (payload). Uma simples reordenação de instruções assembly ou a inserção de instruções \`NOP\` desvincula o hash de qualquer indicador de comprometimento (IoC) conhecido.

### Vetores de Extração Heurística
Para contornar tais artifícios, a extração concentra-se em:
1. **Histograma de Bytes e Entropia de Shannon**: Arquivos empacotados ou criptografados exibem entropia próxima a $8.0$ bits/byte nas seções \`.text\` ou \`.data\`.
2. **Tabela de Importação de Funções (IAT)**: Combinações anômalas da WinAPI (ex: \`VirtualAllocEx\` seguida de \`WriteProcessMemory\` e \`CreateRemoteThread\`).
3. **Seções Não Convencionais**: Cabeçalhos corrompidos, carimbos de compilação alterados (*timestamp falsification*) e discrepâncias entre tamanho virtual e tamanho em disco.

\`\`\`python
import pefile
import math

def calculate_shannon_entropy(data: bytes) -> float:
    """Calcula a entropia de Shannon de um buffer binário."""
    if not data:
        return 0.0
    entropy = 0.0
    length = len(data)
    byte_counts = [0] * 256
    for b in data:
        byte_counts[b] += 1
    for count in byte_counts:
        if count > 0:
            p_x = count / length
            entropy -= p_x * math.log2(p_x)
    return entropy
\`\`\`

## 2. Pipeline de Treinamento com LightGBM e Embeddings

No laboratório prático do Módulo 3 da Pós-Graduação, desenvolvemos um pipeline de treinamento utilizando a base *EMBER (Elastic Malware Benchmark for Empowering Researchers)*.

O pipeline abrange:
- Parsing seguro com isolamento em sandbox de memória.
- Normalização de 2.381 características estruturais.
- Ajuste de hiperparâmetros com foco na minimização estrita da taxa de Falsos Positivos ($FPR < 0.1\\%$), métrica crucial para ambientes corporativos reais.

## 3. Síntese com Regras YARA Comportamentais

O modelo neural não substitui a triagem determinística, mas atua como primeiro filtro de decisão. Ao atingir score de confiança superior a $0.85$, o artefato é submetido automaticamente à geração de regras dinâmicas YARA para bloqueio orquestrado via EDR e SIEM.

\`\`\`yara
rule Suspicious_HighEntropy_MemoryInjection {
    meta:
        description = "Detecta injeção de processos acoplada a entropia anômala"
        author = "CEIC Blue Team Labs"
        severity = "High"
    strings:
        $api1 = "VirtualAllocEx" ascii wide
        $api2 = "WriteProcessMemory" ascii wide
        $api3 = "CreateRemoteThread" ascii wide
    condition:
        uint16(0) == 0x5A4D and all of ($api*) and math.entropy(0, filesize) > 7.2
}
\`\`\`

## Conclusão e Aplicação no Cyber Range

A integração entre inteligência artificial e telemetria defensiva consolida a formação de analistas Blue Team capazes de antecipar ameaças zero-day, reduzindo o tempo médio de detecção (MTTD) de semanas para milissegundos.
`,
  },
  {
    frontmatter: {
      title: 'Engenharia de Detecção Avançada com Sigma Rules e MITRE ATT&CK',
      slug: 'engenharia-deteccao-sigma-mitre',
      description: 'Padronização de regras de correlação SIEM agnósticas a fornecedores para caça proativa de técnicas de movimentação lateral e persistência.',
      author: 'Prof. Me. Rodrigo Albuquerque',
      authorRole: 'Especialista em Threat Hunting e Coordenador Técnico',
      pubDate: '2025-07-29',
      category: 'threat-hunting',
      categoryLabel: 'Threat Hunting',
      readTime: '7 min de leitura',
      tags: ['Sigma Rules', 'MITRE ATT&CK', 'SIEM', 'Splunk', 'Wazuh'],
      featured: false,
    },
    excerpt: 'Como estruturar uma esteira de detecção contínua onde hipóteses de ameaças são formalizadas em regras Sigma e convertidas automaticamente para Splunk, Elastic e Wazuh.',
    rawMarkdown: `---
title: "Engenharia de Detecção Avançada com Sigma Rules e MITRE ATT&CK"
slug: "engenharia-deteccao-sigma-mitre"
author: "Prof. Me. Rodrigo Albuquerque"
role: "Coordenador de Detecção e Resposta - CEIC"
pubDate: "2025-07-29"
category: "threat-hunting"
readTime: "7 min"
tags: ["Sigma Rules", "MITRE ATT&CK", "SIEM", "Splunk", "Wazuh"]
---

# Engenharia de Detecção Avançada com Sigma Rules e MITRE ATT&CK

A moderna Engenharia de Detecção (*Detection Engineering*) trata a segurança analítica com os mesmos rigores do desenvolvimento de software: versionamento via Git, testes unitários contra datasets de telemetria e conversão agnóstica para diferentes plataformas SIEM/EDR.

## 1. O Padrão Sigma

O Sigma fornece uma sintaxe estruturada em YAML para descrever padrões em logs de eventos de segurança. Isso liberta as equipes de segurança da dependência de sintaxes proprietárias (como SPL do Splunk ou KQL do Microsoft Sentinel).

### Exemplo: Detecção de Abuso do PowerShell com Codificação Base64 (T1059.001)

\`\`\`yaml
title: Execucao Suspeita de PowerShell Codificado em Base64
id: ceic-det-2025-0042
status: production
description: Identifica chamadas ao powershell.exe utilizando parametros de codificacao (-enc, -encodedcommand) com bypass de politicas de execucao.
references:
    - https://attack.mitre.org/techniques/T1059/001/
author: Laboratorio de Defesa Cibernetica - CEIC
date: 2025/07/28
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith:
            - '\\powershell.exe'
            - '\\pwsh.exe'
        CommandLine|contains:
            - ' -e '
            - ' -enc '
            - ' -encodedcommand '
            - ' -ec '
    filter_legitimate:
        CommandLine|contains: 'ccmexec.exe'
    condition: selection and not filter_legitimate
falsepositives:
    - Scripts de gestao interna devidamente assinados.
level: high
tags:
    - attack.execution
    - attack.t1059.001
\`\`\`

## 2. Esteira de CI/CD para Engenharia de Detecção

No ambiente de residência do CEIC, cada aluno constrói um repositório Git conectado ao transpilador \`pySigma\`. Quando uma nova regra é submetida via pull request:
1. O linter valida a sintaxe e metadados obrigatórios.
2. A regra é testada contra logs sintéticos injetados em um cluster de teste.
3. Se aprovada, o pipeline despacha as consultas para o ambiente Wazuh e Splunk em tempo real.
`,
  },
  {
    frontmatter: {
      title: 'Forense Digital em Memória Volátil: Rastreamento com Volatility 3',
      slug: 'forense-memoria-volatilidade-volatility-3',
      description: 'Metodologia estrita para cadeia de custódia, dump de memória física e identificação de injeções de DLL, hollow processes e rootkits de kernel.',
      author: 'Capitão Dr. Marcos Paiva',
      authorRole: 'Perito Forense Computacional e Docente Convidado',
      pubDate: '2025-06-18',
      category: 'forense-digital',
      categoryLabel: 'Forense Digital',
      readTime: '11 min de leitura',
      tags: ['Volatility', 'Memory Forensics', 'Incident Response', 'Malware', 'DLL Injection'],
      featured: false,
    },
    excerpt: 'A análise de artefatos em disco já não é suficiente quando os adversários operam estritamente in-memory com malware sem arquivo (fileless). Aprenda a dissecar a memória física.',
    rawMarkdown: `---
title: "Forense Digital em Memória Volátil: Rastreamento com Volatility 3"
slug: "forense-memoria-volatilidade-volatility-3"
author: "Capitão Dr. Marcos Paiva"
role: "Docente de Perícia e Forense - CEIC"
pubDate: "2025-06-18"
category: "forense-digital"
readTime: "11 min"
tags: ["Volatility", "Memory Forensics", "Incident Response", "Malware"]
---

# Forense Digital em Memória Volátil: Rastreamento com Volatility 3

Quando incidentes de alta complexidade ocorrem, como ataques de ransomware com estágio de reconhecimento silencioso, os atacantes evitam tocar o disco para eludir antivírus baseados em heurística estática de arquivos. A preservação e análise de memória RAM tornam-se, assim, a única evidência fidedigna da execução.

## 1. Aquisição Forense e Ordem de Volatilidade (RFC 3227)

A ordem de aquisição deve respeitar o tempo de degradação dos artefatos:
1. Registradores da CPU e cache
2. Tabelas de roteamento, cache ARP, conexões de rede em memória
3. Memória física do sistema (RAM)
4. Estado dos discos e arquivos temporários

A aquisição é efetuada utilizando ferramentas aprovadas com verificação de hash SHA-256 imediata, garantindo a admissibilidade probatória segundo o Código de Processo Penal e a jurisprudência de tribunais superiores.

## 2. Plugins Essenciais no Volatility 3

\`\`\`bash
# Listagem da arvore de processos identificando relacoes pai-filho anomálas
python3 vol.py -f memory_dump.raw windows.pstree.PsTree

# Identificacao de processos com permissoes PAGE_EXECUTE_READWRITE suspeitas
python3 vol.py -f memory_dump.raw windows.malfind.Malfind

# Verificacao de sockets de rede ativos no momento da captura
python3 vol.py -f memory_dump.raw windows.netscan.NetScan
\`\`\`

## 3. Identificação de Process Hollowing e Injeções de Código

O plugin \`windows.malfind\` localiza páginas de memória marcadas com permissões de execução que não estão atreladas a arquivos mapeados em disco. Isso frequentemente aponta para DLLs descompactadas diretamente na memória de processos legítimos como \`svchost.exe\` ou \`explorer.exe\`.
`,
  },
  {
    frontmatter: {
      title: 'Transição para Criptografia Pós-Quântica (PQC) na Infraestrutura Crítica',
      slug: 'transicao-criptografia-pos-quantica',
      description: 'Análise de vulnerabilidades dos algoritmos RSA/ECC frente ao Algoritmo de Shor e aplicação dos padrões FIPS 203 (ML-KEM) e FIPS 204 (ML-DSA).',
      author: 'Dra. Beatriz Menezes',
      authorRole: 'Pesquisadora em Teoria da Informação e Segurança de Redes',
      pubDate: '2025-05-02',
      category: 'criptografia',
      categoryLabel: 'Criptografia Avançada',
      readTime: '8 min de leitura',
      tags: ['PQC', 'Quantum Security', 'NIST', 'ML-KEM', 'Zero Trust'],
      featured: false,
    },
    excerpt: 'O ataque "Harvest Now, Decrypt Later" já é uma realidade geopolítica. Compreenda como governos e corporações de infraestrutura crítica estão iniciando a transição para cifras resistentes a computadores quânticos.',
    rawMarkdown: `---
title: "Transição para Criptografia Pós-Quântica (PQC) na Infraestrutura Crítica"
slug: "transicao-criptografia-pos-quantica"
author: "Dra. Beatriz Menezes"
role: "Pesquisadora de Criptografia - CEIC"
pubDate: "2025-05-02"
category: "criptografia"
readTime: "8 min"
tags: ["PQC", "Quantum Security", "NIST", "ML-KEM", "Zero Trust"]
---

# Transição para Criptografia Pós-Quântica (PQC) na Infraestrutura Crítica

O advento de computadores quânticos de escala com correção de erros tornará o algoritmo de fatoração inteira de Shor capaz de quebrar esquemas de chave pública estabelecidos, como RSA-2048/4096 e curvas elípticas ECDSA/ECDH.

## 1. A Ameaça "Harvest Now, Decrypt Later" (HNDL)

Atores estatais e cibercriminosos avançados já interceptam e armazenam terabytes de tráfego TLS criptografado de infraestruturas estratégicas (bancos, sistemas elétricos, telecomunicações e defesa). Quando um processador quântico viável estiver operacional (o chamado momento *Q-Day*), essas chaves serão decifradas retroativamente.

## 2. Os Padrões Definitivos do NIST (FIPS 203, 204 e 205)

O NIST concluiu a padronização primária de algoritmos baseados em reticulados euclidianos (*lattices*):
- **ML-KEM (antigo CRYSTALS-Kyber)**: Mecanismo de encapsulamento de chaves para troca de segredos em túneis TLS.
- **ML-DSA (antigo CRYSTALS-Dilithium)**: Assinatura digital primária para certificados e autenticação.
- **SLH-DSA (antigo SPHINCS+)**: Assinatura stateless baseada em hash, servindo como redundância contra fraquezas matemáticas em reticulados.

## 3. Abordagem Híbrida: O Caminho Recomendado

A recomendação técnica ensinada na Pós-Graduação do CEIC é a implantação de cifras híbridas (ex: X25519 combinado com ML-KEM-768), garantindo que a segurança nunca seja inferior à criptografia clássica contemporânea enquanto confere proteção antecipada à computação quântica.
`,
  },
];
