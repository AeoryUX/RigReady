import { handleShopRequest, type ShopBotEnv } from '@workspace/shop-bot/handler';

export default {
  async fetch(request: Request, env: ShopBotEnv): Promise<Response> {
    let cache: Cache | undefined;
    try { cache = await caches.open('rigready-shop-search-v1'); } catch { /* Search works without edge caching. */ }
    return handleShopRequest(request, env, { cache });
  },
};
