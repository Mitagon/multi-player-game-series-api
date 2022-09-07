import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cluster = require('cluster');
const os = require('os');
const PORT = process.env.PORT || 3000;

const cpus = os.cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < cpus; i++) {
    cluster.fork()
  };

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died...`);
    cluster.fork();
  })

} else {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(PORT)
      .then(() => {
        console.log(`Server is runnint on port ${PORT} || ==>>> PID: ${process.pid}`)
      })
  }
  bootstrap();
}


