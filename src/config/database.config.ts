import { createClient } from '@supabase/supabase-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig {
  private supabase;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase 환경변수가 설정되지 않았습니다!');
      console.error('다음 환경변수들을 .env 파일에 추가해주세요:');
      console.error('- SUPABASE_URL=https://your-project-ref.supabase.co');
      console.error('- SUPABASE_ANON_KEY=your_anon_key_here');
      throw new Error(
        'Supabase URL과 Anon Key가 환경변수에 설정되지 않았습니다. ' +
          '.env 파일을 확인해주세요.',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  getClient() {
    return this.supabase;
  }

  // 연결 테스트 메서드
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Supabase 연결을 테스트 중...');

      // 단순한 쿼리로 연결 테스트
      const { data, error } = await this.supabase
        .from('user')
        .select('count(*)')
        .limit(1);

      if (error) {
        console.error('❌ Supabase 연결 테스트 실패:', error.message);
        console.error('💡 확인사항:');
        console.error('  1. SUPABASE_URL이 올바른지 확인');
        console.error('  2. SUPABASE_ANON_KEY가 올바른지 확인');
        console.error('  3. 데이터베이스에 "user" 테이블이 존재하는지 확인');
        return false;
      }

      console.log('✅ Supabase 연결 성공!');
      return true;
    } catch (error) {
      console.error('❌ Supabase 연결 중 오류 발생:', error.message);
      return false;
    }
  }
}
