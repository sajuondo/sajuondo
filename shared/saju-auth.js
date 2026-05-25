/* ============================================================
 * 사주온도 — 공유 인증 & 사주 데이터 모듈 (v2: lazy load)
 * Supabase CDN 로딩 타이밍과 무관하게 안전하게 동작.
 * ============================================================ */

(function() {
  'use strict';

  const SUPABASE_URL = 'https://hzuyolgaslvybvxgyiux.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_ivnJ7WpsgSf0Xkx0SJPstA_yvr4pwQO';

  let _sbCache = null;
  function _getSb() {
    if (_sbCache) return _sbCache;
    if (typeof window === 'undefined' || !window.supabase) {
      return null;
    }
    _sbCache = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return _sbCache;
  }

  function safeGet(key) { try { return localStorage.getItem(key); } catch(e) { return null; } }
  function safeSet(key, val) { try { localStorage.setItem(key, val); return true; } catch(e) { return false; } }
  function safeRemove(key) { try { localStorage.removeItem(key); } catch(e) {} }

  const SajuStore = {
    LOCAL_KEY: 'sajuondo:result',

    save(result) {
      safeSet(this.LOCAL_KEY, JSON.stringify({ ...result, savedAt: Date.now() }));
      this.syncToCloud(result).catch(e => console.warn('cloud sync failed', e));
    },

    load() {
      try {
        const raw = safeGet(this.LOCAL_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch(e) { return null; }
    },

    clear() { safeRemove(this.LOCAL_KEY); },

    hasAnalysis() {
      const r = this.load();
      return !!(r && r.ilju && typeof r.temperature === 'number');
    },

    async syncToCloud(result) {
      const sb = _getSb();
      if (!sb) return;
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;
      try {
        await sb.from('user_saju').upsert({
          user_id: user.id,
          ilju: result.ilju,
          ilju_kr: result.iljuKr,
          temperature: result.temperature,
          yongsin: result.yongsin,
          strongest: result.strongest,
          geukguk_name: result.geukguk?.name || null,
          distribution: result.distribution,
          input_year: result.input?.year,
          input_month: result.input?.month,
          input_day: result.input?.day,
          input_hour: result.input?.hour,
          gender: result.input?.gender,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      } catch(e) { console.warn('cloud sync failed', e); }
    },

    async loadFromCloud() {
      const sb = _getSb();
      if (!sb) return null;
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return null;
      const { data } = await sb.from('user_saju').select('*').eq('user_id', user.id).maybeSingle();
      if (!data) return null;
      return {
        ilju: data.ilju, iljuKr: data.ilju_kr, temperature: data.temperature,
        yongsin: data.yongsin, strongest: data.strongest,
        geukguk: { name: data.geukguk_name }, distribution: data.distribution,
        input: {
          year: data.input_year, month: data.input_month,
          day: data.input_day, hour: data.input_hour, gender: data.gender
        }
      };
    }
  };

  const SajuAuth = {
    get client() { return _getSb(); },

    async getUser() {
      const sb = _getSb();
      if (!sb) return null;
      try {
        const { data: { user } } = await sb.auth.getUser();
        return user;
      } catch(e) { return null; }
    },

    async signInWithGoogle() {
      const sb = _getSb();
      if (!sb) { alert('인증 시스템 로딩 중입니다. 잠시 후 다시 시도해주세요.'); return; }
      const { data, error } = await sb.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.href }
      });
      if (error) console.error(error);
      return data;
    },

    async signOut() {
      const sb = _getSb();
      if (sb) await sb.auth.signOut();
      SajuStore.clear();
      window.location.reload();
    },

    async ensureNickname() {
      const sb = _getSb();
      if (!sb) return null;
      const user = await this.getUser();
      if (!user) return null;
      const { data: existing } = await sb
        .from('user_profile').select('nickname').eq('user_id', user.id).maybeSingle();
      return existing?.nickname || null;
    },

    async setNickname(nickname) {
      const sb = _getSb();
      if (!sb) throw new Error('인증 시스템 로딩 중');
      const user = await this.getUser();
      if (!user) throw new Error('not logged in');
      if (!nickname || nickname.length < 2 || nickname.length > 16) {
        throw new Error('닉네임은 2~16자여야 합니다');
      }
      const { error } = await sb.from('user_profile').upsert({
        user_id: user.id, nickname, email: user.email,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      if (error) {
        if (error.code === '23505') throw new Error('이미 사용중인 닉네임입니다');
        throw error;
      }
      return true;
    }
  };

  async function renderAuthChip(containerId = 'nav-auth') {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (!_getSb()) {
      el.innerHTML = '<span style="font-size:12px;color:var(--ink-4);">…</span>';
      setTimeout(() => renderAuthChip(containerId), 400);
      return;
    }

    const user = await SajuAuth.getUser();
    const saju = SajuStore.load();

    if (user) {
      const profile = await SajuAuth.ensureNickname();
      const nick = profile || user.email?.split('@')[0] || '익명';
      const tempStr = saju ? `${saju.temperature}°` : '';
      el.innerHTML = `
        <div id="user-menu-trigger" style="display:flex;align-items:center;gap:8px;padding:6px 12px;border:1px solid var(--line,rgba(20,18,16,.1));border-radius:999px;background:rgba(255,255,255,.5);font-size:12px;cursor:pointer;">
          ${tempStr ? `<span style="font-family:'DM Serif Display',serif;font-size:14px;color:var(--mint-dark,#007a65);">${tempStr}</span>` : ''}
          <span>${nick}</span>
        </div>
      `;
      el.querySelector('#user-menu-trigger').onclick = async () => {
        if (confirm('로그아웃 하시겠습니까?')) await SajuAuth.signOut();
      };
    } else {
      el.innerHTML = `
        <button id="login-btn" style="padding:8px 16px;font-size:12px;background:transparent;color:var(--ink,#141210);border:1px solid var(--line,rgba(20,18,16,.1));border-radius:999px;cursor:pointer;">
          로그인
        </button>
      `;
      el.querySelector('#login-btn').onclick = () => SajuAuth.signInWithGoogle();
    }
  }

  window.SajuStore = SajuStore;
  window.SajuAuth = SajuAuth;
  window.renderAuthChip = renderAuthChip;

})();
