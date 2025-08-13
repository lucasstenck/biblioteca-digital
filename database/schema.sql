-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS app_livros CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE app_livros;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    numero VARCHAR(15) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_login (login)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de livros
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    descricao_completa LONGTEXT,
    autor VARCHAR(255),
    categoria VARCHAR(100),
    imagem_capa VARCHAR(255),
    arquivo_pdf VARCHAR(255),
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_titulo (titulo),
    INDEX idx_categoria (categoria),
    INDEX idx_downloads (download_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir livros baseados nas pastas disponíveis
INSERT INTO books (titulo, descricao, descricao_completa, autor, categoria, imagem_capa, arquivo_pdf) VALUES
('13 Coisas que as Pessoas Mentalmente Fortes não Fazem', 
 'Aprenda a desenvolver resiliência mental e superar desafios com estratégias comprovadas.',
 'Este livro revela os 13 hábitos que as pessoas mentalmente fortes evitam para manter sua resiliência e força interior. A autora Amy Morin compartilha insights valiosos sobre como desenvolver uma mentalidade robusta e enfrentar as adversidades da vida com coragem e determinação.',
 'Amy Morin', 'Desenvolvimento Pessoal', '13-coisas-1.png', '13-coisas.pdf'),

('48 Leis do Poder', 
 'Um guia completo sobre as estratégias de poder utilizadas pelos grandes líderes da história.',
 'Robert Greene analisa 48 princípios fundamentais do poder, baseados em exemplos históricos de líderes, estrategistas e figuras influentes. Cada lei é ilustrada com casos reais e oferece insights sobre como navegar complexas dinâmicas de poder.',
 'Robert Greene', 'Estratégia e Poder', '48-leis-1.png', 'as-48-leis-do-poder.pdf'),

('A Sutil Arte de Ligar o Foda-se', 
 'Uma abordagem irreverente para viver uma vida mais autêntica e significativa.',
 'Mark Manson desafia as convenções tradicionais de autoajuda com uma perspectiva realista e direta. O livro ensina como identificar o que realmente importa na vida e como deixar de lado as preocupações desnecessárias.',
 'Mark Manson', 'Desenvolvimento Pessoal', 'sutil-arte-1.png', 'ARQUIVO_PAGINA.pdf'),

('Atitude Mental Positiva', 
 'Transforme sua vida através do poder do pensamento positivo e da mentalidade correta.',
 'Este clássico ensina como cultivar uma atitude mental positiva para superar obstáculos e alcançar o sucesso. Baseado em princípios comprovados, mostra como a mentalidade pode transformar completamente os resultados na vida.',
 'Napoleon Hill e W. Clement Stone', 'Desenvolvimento Pessoal', 'atitude-mental-1.png', 'Atitude Mental Positiva.pdf'),

('Como Convencer Alguém em 90 Segundos', 
 'Técnicas rápidas e eficazes para influenciar e persuadir em qualquer situação.',
 'Nicholas Boothman revela estratégias práticas para estabelecer conexão e influência em apenas 90 segundos. O livro combina psicologia, linguagem corporal e técnicas de comunicação para maximizar o impacto das suas interações.',
 'Nicholas Boothman', 'Comunicação e Persuasão', 'convencer-90s-1.png', 'COMO CONVENCER UMA PESSOA EM 90 SEGUNDOS.pdf'),

('Como Falar com Qualquer Pessoa', 
 'Desenvolva habilidades de comunicação para conectar com qualquer pessoa em qualquer situação.',
 'Este guia prático oferece técnicas comprovadas para melhorar suas habilidades de comunicação, quebrar o gelo e construir relacionamentos significativos. Ideal para quem quer se tornar mais sociável e carismático.',
 'Leil Lowndes', 'Comunicação', 'falar-qualquer-1.png', 'Como Falar com Qualquer Pessoa.pdf'),

('Como Fazer Amigos e Influenciar Pessoas', 
 'O clássico definitivo sobre relacionamentos humanos e influência pessoal.',
 'Dale Carnegie criou um dos livros mais influentes sobre relacionamentos humanos. Com princípios atemporais, ensina como construir amizades duradouras, resolver conflitos e influenciar pessoas de forma ética e eficaz.',
 'Dale Carnegie', 'Relacionamentos', 'fazer-amigos-1.png', 'Como-Fazer-Amigos-e-Influenciar-Pessoas.pdf'),

('Mais Esperto que o Diabo', 
 'Descubra os segredos da liberdade e do sucesso através de uma conversa reveladora.',
 'Napoleon Hill apresenta uma conversa fictícia com o diabo, revelando os princípios fundamentais para conquistar a liberdade pessoal e o sucesso. Um livro único que desafia convenções e oferece insights profundos sobre a natureza humana.',
 'Napoleon Hill', 'Desenvolvimento Pessoal', 'mais-esperto-1.png', 'Mais-Esperto-que-o-Diabo.pdf'),

('Manual de Persuasão do FBI', 
 'Técnicas secretas de persuasão utilizadas pelos agentes do FBI em interrogatórios.',
 'Este manual revela as estratégias de persuasão e influência utilizadas pelos agentes do FBI para obter informações e confissões. Uma fonte valiosa de técnicas psicológicas para influenciar e persuadir de forma ética.',
 'FBI', 'Persuasão e Psicologia', 'manual-persuasao-1.png', 'Manual-de-persuasao-do-FBI.pdf'),

('Mindset: A Nova Psicologia do Sucesso', 
 'Descubra como sua mentalidade pode determinar seu sucesso na vida e nos negócios.',
 'Carol Dweck apresenta a poderosa distinção entre mindset fixo e crescimento. O livro mostra como a forma como você vê suas capacidades pode impactar dramaticamente seu aprendizado, desenvolvimento e conquistas ao longo da vida.',
 'Carol Dweck', 'Psicologia e Sucesso', 'mindset-1.png', 'Mindset-A-Nova-Psicologia-do-Sucesso.pdf'),

('O Ego é Seu Inimigo', 
 'Aprenda a controlar seu ego para alcançar maior sucesso e satisfação pessoal.',
 'Ryan Holiday explora como o ego pode ser o maior obstáculo para o sucesso e a felicidade. Através de exemplos históricos e insights práticos, ensina como manter o ego sob controle e focar no que realmente importa.',
 'Ryan Holiday', 'Desenvolvimento Pessoal', 'ego-inimigo-1.png', 'O Ego É seu Inimigo.pdf'),

('O Homem Mais Rico da Babilônia', 
 'Lições atemporais sobre riqueza e prosperidade baseadas em princípios antigos.',
 'George S. Clason apresenta princípios de riqueza através de parábolas da antiga Babilônia. Este clássico ensina fundamentos sólidos sobre economia, investimento e construção de riqueza que permanecem relevantes até hoje.',
 'George S. Clason', 'Finanças Pessoais', 'homem-rico-babilonia-1.png', 'O-Homem-Mais-Rico-da-Babilonia.pdf'),

('O Poder da Ação', 
 'Transforme seus sonhos em realidade através da ação consistente e determinada.',
 'Paulo Vieira apresenta um método prático para superar a procrastinação e transformar objetivos em resultados. O livro combina psicologia, coaching e estratégias práticas para maximizar sua produtividade e alcançar metas.',
 'Paulo Vieira', 'Produtividade', 'poder-acao-1.png', 'O-Poder-da-Acao.pdf'),

('O Poder do Hábito', 
 'Entenda como os hábitos funcionam e como transformá-los para melhorar sua vida.',
 'Charles Duhigg explora a ciência por trás dos hábitos e como eles podem ser modificados para criar mudanças positivas. O livro oferece um framework prático para identificar, entender e transformar padrões comportamentais.',
 'Charles Duhigg', 'Psicologia e Hábitos', 'poder-habito-1.png', 'O_poder_do_Habito.pdf'),

('Os Primeiros 90 Dias', 
 'Estratégias essenciais para uma transição bem-sucedida em novos cargos e desafios.',
 'Michael Watkins oferece um guia completo para navegar os primeiros 90 dias em uma nova posição ou desafio. Com estratégias práticas e insights de especialistas, ajuda a maximizar o sucesso em transições profissionais.',
 'Michael Watkins', 'Carreira e Liderança', 'primeiros-90-1.png', 'Os primeiros 90 dias.pdf'),

('Os Segredos da Mente Milionária', 
 'Descubra os padrões de pensamento que diferenciam os ricos dos pobres.',
 'T. Harv Eker revela os padrões de pensamento e comportamento que determinam o sucesso financeiro. O livro identifica 17 arquivos de riqueza que podem ser reprogramados para transformar sua relação com o dinheiro.',
 'T. Harv Eker', 'Finanças Pessoais', 'segredos-mente-milionaria-1.png', 'Os_Segredos_Da_Mente_Milionaria.pdf'),

('Os 7 Hábitos das Pessoas Altamente Eficazes', 
 'Princípios fundamentais para efetividade pessoal e interpessoal.',
 'Stephen R. Covey apresenta sete hábitos que podem transformar sua vida pessoal e profissional. Este clássico ensina como desenvolver caráter, construir relacionamentos e alcançar objetivos através de princípios atemporais.',
 'Stephen R. Covey', 'Desenvolvimento Pessoal', '7-habitos-1.png', 'Os-7-habitos-das-pessoas-altamente-eficazes.pdf'),

('Pai Rico, Pai Pobre', 
 'Lições sobre dinheiro e investimento que não são ensinadas na escola.',
 'Robert Kiyosaki compartilha as lições sobre dinheiro que aprendeu de seu pai rico versus seu pai pobre. O livro desafia convenções sobre educação financeira e oferece uma nova perspectiva sobre riqueza e independência financeira.',
 'Robert Kiyosaki', 'Finanças Pessoais', 'pai-rico-pai-pobre-1.png', 'pai-rico-pai-pobre.pdf'),

('Quem Pensa Enriquece', 
 'Os princípios atemporais do sucesso baseados no pensamento positivo e na ação.',
 'Napoleon Hill apresenta os princípios fundamentais do sucesso baseados em anos de pesquisa com pessoas bem-sucedidas. O livro ensina como transformar pensamentos em riqueza através de princípios comprovados e ação consistente.',
 'Napoleon Hill', 'Desenvolvimento Pessoal', 'quem-pensa-enriquece-1.png', 'Quem Pensa Enriquece.pdf');

-- Criar índices para melhor performance
CREATE INDEX idx_books_titulo_autor ON books(titulo, autor);
CREATE INDEX idx_books_categoria_downloads ON books(categoria, download_count);
