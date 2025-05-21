import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import axios from 'axios';
import fastifyCors from '@fastify/cors';



const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  
  const animepahe = new ANIME.AnimePahe();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro:
        "Welcome to the animepahe provider: check out the provider's website @ https://animepahe.com/",
      routes: ['/:query', '/info/:id', '/watch/:episodeId', '/proxy'],
      documentation: 'https://docs.consumet.org/#tag/animepahe',
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;

    const res = await animepahe.search(query);

    reply.status(200).send(res);
  });

  fastify.get('/info/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = decodeURIComponent((request.params as { id: string }).id);

    const episodePage = (request.query as { episodePage: number }).episodePage;

    try {
      const res = await animepahe
        .fetchAnimeInfo(id, episodePage)
        .catch((err) => reply.status(404).send({ message: err }));

      reply.status(200).send(res);
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get(
    '/watch',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.query as { episodeId: string }).episodeId;
      try {
        const res = await animepahe.fetchEpisodeSources(episodeId);

        reply.status(200).send(res);
      } catch (err) {
        console.log(err);
        reply
          .status(500)
          .send({ message: 'Something went wrong. Contact developer for help.' });
      }
    },
  );

  // fastify.get('/proxy', async (request : FastifyRequest, reply : FastifyReply) => {
  //   const { url } = request.query as { url: string };
  
  //   if (!url) {
  //     return reply.status(400).send({ error: 'URL parameter is required' });
  //   }
  
  //   try {
  //     const decodedUrl = decodeURIComponent(url);
      
  //     // Validate the URL is from kwikie.ru
  //     if (!decodedUrl.includes('kwikie.ru')) {
  //       return reply.status(400).send({ error: 'Invalid streaming URL' });
  //     }
  
  //     const response = await axios.get(decodedUrl, {
  //       responseType: 'stream',
  //       headers: {
  //         'Referer': 'https://kwik.si/',
  //         'Origin': 'https://kwik.si/',
  //         'User-Agent': request.headers['user-agent'] || ''
  //       }
  //     });
  
  //     // Forward important headers
  //     reply.header('Content-Type', response.headers['content-type']);
  //     reply.header('Cache-Control', 'public, max-age=3600');
      
  //     return reply.send(response.data);
  //   } catch (error) {
  //     fastify.log.error(error);
  //     return reply.status(500).send({ error: 'Failed to fetch stream' });
  //   }
  // });
  fastify.get('/proxy', async (request, reply) => {
    const { url } = request.query as { url: string };
    if (!url) return reply.status(400).send({ error: 'URL required' });
  
    try {
      const decodedUrl = decodeURIComponent(url);
      const response = await axios.get(decodedUrl, {
        responseType: decodedUrl.endsWith('.m3u8') ? 'text' : 'stream',
        headers: {
          Referer: 'https://kwik.si/',
          Origin: 'https://kwik.si/',
        }
      });
  
      // If it's a playlist, rewrite its contents
      if (decodedUrl.endsWith('.m3u8')) {
        let playlist = response.data;
  
        playlist = playlist.replace(/(https?:\/\/[^\s\n\r"]+)/g, (match : any) => {
          return `http://localhost:3000/proxy?url=${encodeURIComponent(match)}`;
        });
  
        reply.header('Content-Type', 'application/vnd.apple.mpegurl');
        reply.header('Access-Control-Allow-Origin', '*');
        return reply.send(playlist);
      }
  
      // Otherwise just stream media (ts/key files)
      reply.header('Content-Type', response.headers['content-type']);
      reply.header('Access-Control-Allow-Origin', '*');
      return reply.send(response.data);
    } catch (error : any) {
      console.error('Proxy error:', error.message);
      return reply.status(500).send({ error: 'Proxy failed' });
    }
});
};

export default routes;
