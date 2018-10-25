-- Admin

INSERT INTO public."Admin"(
	"idAdmin", senha, nome, ativo, email, role, "createdAt", "updatedAt", "deletedAt")
	VALUES (1, '$2a$08$S0qqmzr1dxtXkZiObeL42uFVxfeNYPMagQmTScywiy.PFKMt1pxfq', 'nenedsAdmin', true, 'mobigapdesenvolvimento@gmail.com', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL);

-- Usuario

INSERT INTO "Usuario" ("idUsuario","senha","nome","telefone","ativo","email","notificar","promocao","creditos","tokenPromo","provider","role","resetPasswordToken","resetPasswordExpires","createdAt","updatedAt") VALUES (DEFAULT,'$2a$08$/g.gl88x8Dn7f1043wQ//uTpRH.X8eXHhmI2ZH99C2XnASHyZn/ry','Dennis Merli','(61) 98147-8527',true,'nenetest2@gmail.com',false,false,0,'dd373a7f9ad9','cadastro','usuario','4546195295c42821c2db1bbc44a89389f1625e65','2016-11-23 01:54:18.751 +00:00','2016-11-22 01:54:18.754 +00:00','2016-11-22 01:54:18.754 +00:00');

INSERT INTO "Usuario" ("idUsuario","senha","nome","telefone","ativo","email","notificar","promocao","creditos","tokenPromo","provider","role","resetPasswordToken","resetPasswordExpires","createdAt","updatedAt") VALUES (DEFAULT,'$2a$08$7I.gx2wjGnW7.fiz8UKNK.Y5FeBkt1WpDTMEsEv1Vl4EM/LuydJ7q','Hually Smadi','(61) 98163-1278',true,'huallyd@gmail.com',false,false,0,'ce72d381028b','cadastro','usuario','cbe907181ef23d379362ef7976f21e2bc31161d6','2016-11-23 01:55:34.009 +00:00','2016-11-22 01:55:34.010 +00:00','2016-11-22 01:55:34.010 +00:00');

INSERT INTO "Usuario" ("idUsuario","senha","nome","telefone","ativo","email","notificar","promocao","creditos","tokenPromo","provider","role","resetPasswordToken","resetPasswordExpires","createdAt","updatedAt") VALUES (DEFAULT,'$2a$08$F9LGrTJ/h8GRE0fiBy1eYeg4crVeI.lJeyGTKq79gkMiQpoOpxfKS','Felipe Perius','(61) 99975-1234',true,'felipe.perius@gmail.com',false,false,0,'c5e6bbd4d127','cadastro','usuario','2c8cbb0eef54a06d31ab26dcd7d64ee166c55614','2016-11-23 01:56:46.297 +00:00','2016-11-22 01:56:46.297 +00:00','2016-11-22 01:56:46.297 +00:00');

INSERT INTO "Usuario" ("idUsuario","senha","nome","telefone","ativo","email","notificar","promocao","creditos","tokenPromo","provider","role","resetPasswordToken","resetPasswordExpires","createdAt","updatedAt") VALUES (DEFAULT,'$2a$08$z8rHpyydrSNK178gkaHI.uo2JyijuQk4vxTJVhLIuwHIJMGiFt1YS','Lazaro Lima','(61) 98274-6689',true,'lazaro.lima.12@gmail.com',false,false,0,'9a982af9f045','cadastro','usuario','11b33db15601ffc32f8dccd4630b44f31dde2a66','2016-11-23 01:58:11.727 +00:00','2016-11-22 01:58:11.728 +00:00','2016-11-22 01:58:11.728 +00:00');


-- EnderecoUsuario
INSERT INTO "Endereco" ("idEndereco","titulo","endereco","bairro","cep","dono","referencia","ativo","createdAt","updatedAt","cidadeID","usuarioIdUsuario") VALUES (DEFAULT,'Minha Casa ','QNA 26 - Fundos','Taguatinga','72115-145','usuario','Perto do congresso',true,'2016-11-22 02:32:38.196 +00:00','2016-11-22 02:32:38.196 +00:00','882','1');

INSERT INTO "Endereco" ("idEndereco","titulo","endereco","bairro","cep","dono","referencia","ativo","createdAt","updatedAt","cidadeID","usuarioIdUsuario") VALUES (DEFAULT,'Minha Querida Casinha','Setor Leste Quadra 29','Gama','73115-145','usuario','Perto da FGA',true,'2016-11-22 02:33:58.054 +00:00','2016-11-22 02:33:58.054 +00:00','882','2');

INSERT INTO "Endereco" ("idEndereco","titulo","endereco","bairro","cep","dono","referencia","ativo","createdAt","updatedAt","cidadeID","usuarioIdUsuario") VALUES (DEFAULT,'Minha Casa na VP','Rua 4 Chacara 200','Vicente Pires','71115-145','usuario','Perto do Taguaparque',true,'2016-11-22 02:35:00.916 +00:00','2016-11-22 02:35:00.916 +00:00','882','3');

INSERT INTO "Endereco" ("idEndereco","titulo","endereco","bairro","cep","dono","referencia","ativo","createdAt","updatedAt","cidadeID","usuarioIdUsuario") VALUES (DEFAULT,'Meu Lar','Rua 452 Lote 213','Brasilia','70500-123','usuario','Perto da Torre de TV',true,'2016-11-22 02:35:58.509 +00:00','2016-11-22 02:35:58.509 +00:00','882','4');



-- Entregador

INSERT INTO "Entregador" ("idEntregador","senha","cpf","nome","ativo","isAutonomo","email","role","veiculoNome","veiculoPlaca","veiculoMarca","createdAt","updatedAt") VALUES (DEFAULT,'$2a$08$AIZDIMtJ22F6v7k3EfRJoOiai6wZpLynpvLgqRCz1DjpO45orU1Z6','872.158.465-63','Fausto Silva',true,false,'fausto@silva.com','entregador','CG 125','JGA-9728','Honda','2016-11-22 02:03:22.162 +00:00','2016-11-22 02:03:22.162 +00:00');
INSERT INTO "EntregadorData" ("idEntregadorData","botijoes","disponivel","ativo","createdAt","updatedAt","entregadorIdEntregador") VALUES (DEFAULT,0,true,true,'2016-11-22 02:03:22.258 +00:00','2016-11-22 02:03:22.258 +00:00','1');

INSERT INTO "Entregador" ("idEntregador","senha","cpf","nome","ativo","isAutonomo","email","role","veiculoNome","veiculoPlaca","veiculoMarca","createdAt","updatedAt") VALUES (DEFAULT,'$2a$08$KCuHZqnP0wsfZ/4POxoHPu.kn6hiXVZxIUC6kCyE96OBXJK2xQ6tC','163.943.065-25','Apolonio dos Santos',true,false,'apolonio@santos.com','entregador','Ninja','APO-5450','Kawasaki ','2016-11-22 02:05:55.574 +00:00','2016-11-22 02:05:55.574 +00:00');
INSERT INTO "EntregadorData" ("idEntregadorData","botijoes","disponivel","ativo","createdAt","updatedAt","entregadorIdEntregador") VALUES (DEFAULT,0,true,true,'2016-11-22 02:05:55.634 +00:00','2016-11-22 02:05:55.634 +00:00','2');


INSERT INTO "Entregador" ("idEntregador","senha","cpf","nome","ativo","isAutonomo","email","role","veiculoNome","veiculoPlaca","veiculoMarca","createdAt","updatedAt") VALUES (DEFAULT,'$2a$08$B9clNUv7WGi.fUewyy/DOOQ7lyczWouVt.yz8q2bVq7is0KjEpnHW','793.332.132-10','Willian Bonemer',true,false,'willian@bonemer.com','entregador','Strada','FIA-1976','Fiat','2016-11-22 02:08:26.281 +00:00','2016-11-22 02:08:26.281 +00:00');
 INSERT INTO "EntregadorData" ("idEntregadorData","botijoes","disponivel","ativo","createdAt","updatedAt","entregadorIdEntregador") VALUES (DEFAULT,0,true,true,'2016-11-22 02:08:26.345 +00:00','2016-11-22 02:08:26.345 +00:00','3');


-- LocalizacaoEntregador
UPDATE "EntregadorData" SET "point"=ST_GeomFromGeoJSON('{"type":"Point","coordinates":["-15.836653","-48.044363"]}'),"updatedAt"='2016-11-22 13:47:46.666 +00:00' WHERE "entregadorIdEntregador" = '1';
UPDATE "EntregadorData" SET "point"=ST_GeomFromGeoJSON('{"type":"Point","coordinates":["-15.804432","-47.938935"]}'),"updatedAt"='2016-11-22 13:49:12.390 +00:00' WHERE "entregadorIdEntregador" = '2';
UPDATE "EntregadorData" SET "point"=ST_GeomFromGeoJSON('{"type":"Point","coordinates":["-16.0134029","-48.0646508"]}'),"updatedAt"='2016-11-22 13:52:28.631 +00:00' WHERE "entregadorIdEntregador" = '3';


-- Termos
INSERT INTO "Termo" ("idTermo","texto","versao","ativo","createdAt","updatedAt") VALUES (DEFAULT,' O que é Lorem Ipsum?  Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker.',1,true,'2016-11-28 02:20:21.877 +00:00','2016-11-28 02:20:21.877 +00:00');

--Produtos
INSERT INTO "Produto" ("idProduto","nome","descricao","valor","marca","ativo","createdAt","updatedAt","cidadeID") VALUES (DEFAULT,'Botijao legal 13Kg','Botijao prateado',89.5,'',true,'2016-11-28 02:31:54.282 +00:00','2016-11-28 02:31:54.282 +00:00','5566');

--Distribuidora

INSERT INTO "Distribuidora" ("idDistribuidora","nome","email","senha","cnpj","role","ativo","createdAt","updatedAt") VALUES (DEFAULT,'Distribuidora do Miltinho','miltinho@gmail.com','$2a$08$B9clNUv7WGi.fUewyy/DOOQ7lyczWouVt.yz8q2bVq7is0KjEpnHW','59554814000110','dist',true,'2016-12-22 22:53:43.0+00:00','2016-12-22 22:53:43.041 +00:00');