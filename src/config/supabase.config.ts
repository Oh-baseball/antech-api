import { createClient } from '@supabase/supabase-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SupabaseConfig {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase URL과 API Key가 환경변수에 설정되지 않았습니다. ' +
          'SUPABASE_URL과 SUPABASE_ANON_KEY를 .env 파일에 추가해주세요.',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false, // 서버 사이드에서는 세션 지속성 비활성화
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }

  getClient() {
    return this.supabase;
  }

  // 헬스체크를 위한 연결 테스트
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('users') // 테이블명 변경: user -> users
        .select('count(*)')
        .limit(1);

      if (error) {
        console.error('Supabase 연결 테스트 실패:', error);
        return false;
      }

      console.log('✅ Supabase 연결 성공');
      return true;
    } catch (error) {
      console.error('Supabase 연결 오류:', error);
      return false;
    }
  }
}

// Supabase 클라이언트 인스턴스를 Export (의존성 주입용)
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase 환경변수가 설정되지 않았습니다.\n' +
        '다음 변수들을 .env 파일에 추가해주세요:\n' +
        '- SUPABASE_URL=your_supabase_project_url\n' +
        '- SUPABASE_ANON_KEY=your_supabase_anon_key',
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
};
