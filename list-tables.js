import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fycskldchqqqohgvioal.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5Y3NrbGRjaHFxcW9oZ3Zpb2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MDQxOTMsImV4cCI6MjA4MjQ4MDE5M30.vC5GkVPi9mZwkSNQG_ajVcRnWN8pyYGD0xQbl8Uhco0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function listTables() {
  try {
    console.log('🔍 Conectando ao Supabase...\n');
    
    // Query para listar todas as tabelas do schema public
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_schema')
      .eq('table_schema', 'public');
    
    if (error) {
      console.error('❌ Erro ao listar tabelas (método 1):', error.message);
      console.log('\n📌 Tentando método alternativo via RPC...\n');
      
      // Método alternativo usando raw query
      const { data: result, error: queryError } = await supabase
        .rpc('get_tables');
      
      if (queryError) {
        console.log('⚠️ RPC não disponível. Abra o dashboard em:');
        console.log('🔗 https://app.supabase.com/project/fycskldchqqqohgvioal/editor?schema=public\n');
        return;
      }
      console.log('✅ Tabelas encontradas:\n', result);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('❌ Nenhuma tabela encontrada no schema public.');
      return;
    }
    
    console.log('✅ Tabelas encontradas no schema public:\n');
    data.forEach((table, index) => {
      console.log(`${index + 1}. ${table.table_name}`);
    });
    
    console.log('\n📌 Para ver colunas de uma tabela, use:');
    console.log('   npm run list-tables -- [nome-da-tabela]\n');
    
  } catch (err) {
    console.error('❌ Erro geral:', err.message);
    console.log('\n💡 Dica: Acesse o dashboard diretamente em:');
    console.log('🔗 https://app.supabase.com/project/fycskldchqqqohgvioal/editor?schema=public\n');
  }
}

listTables();
