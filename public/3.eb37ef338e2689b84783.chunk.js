webpackJsonp([3],{sCry:function(l,n,u){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var t=u("WT6e"),e=u("AQpH"),a=u("32NO"),s=u("AfAg"),i=u("huge"),o=u("q3v5"),d=u("rqAq"),_=u("Cu4P"),r=function(){function l(l,n,u,t,e){this.pedidosService=l,this.distribuidoraService=n,this._script=u,this.pedidoService=t,this.usuarioServices=e,this.totalPedidosDia=0,this.valorFinal=[],this.valorTotalVendas=0,this.valorTotalVendasDia=0,this.pedidosEstatisticas={totalOrders:0,deliveredOrders:0,notDeliveredOrders:0,canceledOrders:0},this.user=JSON.parse(localStorage.getItem("currentUser"))}return l.prototype.pedidosDia=function(){var l=this;this.pedidoService.getPedidosDia().subscribe(function(n){l.totalPedidosDia=n;for(var u=[],t=0,e=n;t<e.length;t++)u.push(e[t].valorFinal);l.valorTotalVendasDia=0,l.totalPedidosDia=n.length},function(l){})},l.prototype.ngAfterViewInit=function(){this._script.loadScripts("app-charts-google-charts",["assets/demo/default/custom/components/charts/google-charts.js"])},l.prototype.ngOnInit=function(){"dist"==this.user.role?this.carregarEstatisticas(this.user.idDistribuidora):(this.distribuidoraService.getDistribuidoraSelecionada(),this.carregarEstatisticas(null))},l.prototype.carregarEstatisticas=function(l){var n=this,u=this.distribuidoraService.getDistribuidoraSelecionada();this.pedidosService.getPedidos().subscribe(function(t){if("gerente"===n.user.role)if(n.valorTotalVendasDia=0,null!==u)n.pedidos=t,n.pedidosEstatisticas=i.a.contarPedidos(t,l);else{for(var e=[],a=0,s=t;a<s.length;a++)for(var o=0,d=s[a].pedidos;o<d.length;o++){e.push(d[o]);for(var _=[],r=0,c=e;r<c.length;r++)_.push(c[r].valorFinal);n.valorTotalVendas=0}n.pedidos=e,n.pedidosEstatisticas=i.a.contarPedidos(e,l)}else{_=[];for(var m=0,g=t;m<g.length;m++)_.push(g[m].valorFinal);n.valorTotalVendas=0,n.pedidos=t,n.pedidosEstatisticas=i.a.contarPedidos(t,l)}n.totalPedidosDinheiro=0,n.totalPedidosDebito=0,n.totalPedidosCredito=0;for(var p=0,h=n.pedidos;p<h.length;p++)switch(h[p].tipoPagamento){case 1:++n.totalPedidosDinheiro;break;case 2:++n.totalPedidosDebito;break;case 3:++n.totalPedidosCredito}n.iniciarCharts(),n.iniciarChartSemanal(),n.iniciarChartMensal(),n.iniciarChartVendasTipo(),i.a.setBlockLoading("#resumo-pedidos",!1)},function(l){console.log(l)})},l.prototype.iniciarChartVendasTipo=function(){var l=$("#m_chart_vendas_tipo");0!=l.length&&new Chart(l,{type:"bar",data:{labels:["Dinheiro","D\xe9bito","Cr\xe9dito"],datasets:[{backgroundColor:"#430837",data:[this.totalPedidosDinheiro,this.totalPedidosDebito,this.totalPedidosCredito]}]},options:{title:{display:!1},tooltips:{intersect:!1,mode:"nearest",xPadding:10,yPadding:10,caretPadding:10},legend:{display:!1},responsive:!0,maintainAspectRatio:!1,barRadius:4,scales:{xAxes:[{display:!1,gridLines:!1,stacked:!0}],yAxes:[{display:!1,stacked:!0,gridLines:!1}]},layout:{padding:{left:0,right:0,top:0,bottom:0}}}})},l.prototype.carregarTotalUsuarios=function(){var l=this;$("#m_modal_6").modal("hide"),this.usuarioServices.getUsuarios().subscribe(function(n){l.totalUsers=n.length},function(l){console.log(l)})},l.prototype.iniciarCharts=function(){new Chartist.Pie("#m_chart_profit_share",{series:[{value:this.pedidosEstatisticas.deliveredOrders,className:"custom",meta:{color:mApp.getColor("success")}},{value:this.pedidosEstatisticas.notDeliveredOrders,className:"custom",meta:{color:mApp.getColor("warning")}},{value:this.pedidosEstatisticas.canceledOrders,className:"custom",meta:{color:mApp.getColor("danger")}}],labels:[1,2,3]},{donut:!0,donutWidth:17,showLabel:!1}).on("draw",function(l){if("slice"===l.type){var n=l.element._node.getTotalLength();l.element.attr({"stroke-dasharray":n+"px "+n+"px"});var u={"stroke-dashoffset":{id:"anim"+l.index,dur:1e3,from:-n+"px",to:"0px",easing:Chartist.Svg.Easing.easeOutQuint,fill:"freeze",stroke:l.meta.color}};0!==l.index&&(u["stroke-dashoffset"].begin="anim"+(l.index-1)+".end"),l.element.attr({"stroke-dashoffset":-n+"px",stroke:l.meta.color}),l.element.animate(u,!1)}})},l.prototype.iniciarChartSemanal=function(){var l=$("#m_chart_daily_sales");if(0!=l.length){var n={labels:["Domingo","Segunda-Feira","Ter\xe7a-Feira","Quarta-Feira","Quinta-Feira","Sexta-Feira","S\xe1bado"],datasets:[{backgroundColor:mApp.getColor("success"),data:[15,20,25,30,25,20,15]}]};new Chart(l,{type:"bar",data:n,options:{title:{display:!1},tooltips:{intersect:!1,mode:"nearest",xPadding:10,yPadding:10,caretPadding:10},legend:{display:!1},responsive:!0,maintainAspectRatio:!1,barRadius:4,scales:{xAxes:[{display:!1,gridLines:!1,stacked:!0}],yAxes:[{display:!1,stacked:!0,gridLines:!1}]},layout:{padding:{left:0,right:0,top:0,bottom:0}}}})}},l.prototype.iniciarChartMensal=function(){var l=document.getElementById("m_chart_trends_stats").getContext("2d"),n=l.createLinearGradient(0,0,0,240);n.addColorStop(0,Chart.helpers.color("#00c5dc").alpha(.7).rgbString()),n.addColorStop(1,Chart.helpers.color("#f2feff").alpha(0).rgbString());var u={type:"line",data:{labels:["Janeiro","Fevereiro","Mar\xe7o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro","Janeiro"],datasets:[{label:"Estat\xedsticas de Vendas",backgroundColor:n,borderColor:"#0dc8de",pointBackgroundColor:Chart.helpers.color("#ffffff").alpha(0).rgbString(),pointBorderColor:Chart.helpers.color("#ffffff").alpha(0).rgbString(),pointHoverBackgroundColor:mApp.getColor("danger"),pointHoverBorderColor:Chart.helpers.color("#000000").alpha(.2).rgbString(),data:[20,10,18,63,26,18,15,22,16,12,54,12,20]}]},options:{title:{display:!1},tooltips:{intersect:!1,mode:"nearest",xPadding:10,yPadding:10,caretPadding:10},legend:{display:!1},responsive:!0,maintainAspectRatio:!1,hover:{mode:"index"},scales:{xAxes:[{display:!1,gridLines:!1,scaleLabel:{display:!0,labelString:"Month"}}],yAxes:[{display:!1,gridLines:!1,scaleLabel:{display:!0,labelString:"Value"},ticks:{beginAtZero:!0}}]},elements:{line:{tension:.19},point:{radius:4,borderWidth:12}},layout:{padding:{left:0,right:0,top:5,bottom:0}}}};new Chart(l,u)},l}(),c=function(){},m=u("gpTn"),g=u("jvL2"),p=u("Xjw4"),h=t._2({encapsulation:2,styles:[],data:{}});function v(l){return t._27(0,[(l()(),t._4(0,0,null,null,19,"div",[["class","m-widget1__item"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._4(2,0,null,null,16,"div",[["class","row m-row--no-padding align-items-center"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._4(4,0,null,null,7,"div",[["class","col-xs-10"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._4(6,0,null,null,1,"h3",[["class","m-widget1__title"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                        Usu\xe1rios\n                                    "])),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._4(9,0,null,null,1,"span",[["class","m-widget1__desc"]],null,null,null,null,null)),(l()(),t._25(-1,null,["Total de usu\xe1rios cadastrados"])),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._4(13,0,null,null,4,"div",[["class","col m--align-right"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n\t\t\t\t\t\t\t\t\t"])),(l()(),t._4(15,0,null,null,1,"span",[["class","m-widget1__number m--font-danger"]],null,null,null,null,null)),(l()(),t._25(16,null,["\n\t\t\t\t\t\t\t\t\t\t","\n\t\t\t\t\t\t\t\t\t"])),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._25(-1,null,["\n                        "]))],null,function(l,n){l(n,16,0,n.component.totalUsers)})}function f(l){return t._27(0,[(l()(),t._4(0,0,null,null,22,"div",[["class","m-subheader"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n    "])),(l()(),t._4(2,0,null,null,19,"div",[["class","d-flex align-items-center"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n        "])),(l()(),t._4(4,0,null,null,16,"div",[["class","mr-auto"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n            "])),(l()(),t._4(6,0,null,null,1,"h3",[["class","m-subheader__title m-subheader__title--separator"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                Dashboard\n            "])),(l()(),t._25(-1,null,["\n            "])),(l()(),t._4(9,0,null,null,10,"ul",[["class","m-subheader__breadcrumbs m-nav m-nav--inline"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                "])),(l()(),t._4(11,0,null,null,7,"li",[["class","m-nav__item m-nav__item--home"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                    "])),(l()(),t._4(13,0,null,null,4,"a",[["class","m-nav__link m-nav__link--icon"],["href","#"]],null,[[null,"click"]],function(l,n,u){var e=!0;return"click"===n&&(e=!1!==t._16(l,14).preventDefault(u)&&e),e},null,null)),t._3(14,4210688,null,0,g.a,[t.k],{href:[0,"href"]},null),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._4(16,0,null,null,0,"i",[["class","m-nav__link-icon la la-home"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                    "])),(l()(),t._25(-1,null,["\n                "])),(l()(),t._25(-1,null,["\n            "])),(l()(),t._25(-1,null,["\n        "])),(l()(),t._25(-1,null,["\n    "])),(l()(),t._25(-1,null,["\n"])),(l()(),t._25(-1,null,["\n"])),(l()(),t._25(-1,null,["\n"])),(l()(),t._4(25,0,null,null,217,"div",[["class","m-content"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n\n    \n        \n\n\n\n\n    "])),(l()(),t._4(27,0,null,null,165,"div",[["class","m-portlet"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n        "])),(l()(),t._4(29,0,null,null,162,"div",[["class","m-portlet__body  m-portlet__body--no-padding"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n            "])),(l()(),t._4(31,0,null,null,159,"div",[["class","row m-row--no-padding m-row--col-separator-xl"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                "])),(l()(),t._4(33,0,null,null,89,"div",[["class","col-xl-4"],["id","resumo-usuarios"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                    \n                    "])),(l()(),t._25(-1,null,["\n                    "])),(l()(),t._4(36,0,null,null,84,"div",[["class","m-widget1"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._4(38,0,null,null,15,"div",[["class","m-widget1__item"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._4(40,0,null,null,7,"div",[["class","m-widget14__header m--margin-bottom-30"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._4(42,0,null,null,1,"h3",[["class","m-widget1__title"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                    Vendas por Tipo\n                                "])),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._4(45,0,null,null,1,"span",[["class","m-widget1__desc"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n\t\t\t\t\t\t\t\tResumo das vendas por tipo de pagamento\n\t\t\t\t\t\t\t"])),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._4(49,0,null,null,3,"div",[["class","m-widget14__chart"],["style","height:180px;"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._4(51,0,null,null,0,"canvas",[["id","m_chart_vendas_tipo"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._25(-1,null,["\n                        \n                        "])),(l()(),t._4(55,0,null,null,19,"div",[["class","m-widget1__item"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._4(57,0,null,null,16,"div",[["class","row m-row--no-padding align-items-center"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._4(59,0,null,null,7,"div",[["class","col-xs-10"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._4(61,0,null,null,1,"h3",[["class","m-widget1__title"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                        Vendas Totais\n                                    "])),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._4(64,0,null,null,1,"span",[["class","m-widget1__desc"]],null,null,null,null,null)),(l()(),t._25(-1,null,["Valor total de todas as vendas"])),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._4(68,0,null,null,4,"div",[["class","col m--align-right"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n\t\t\t\t\t\t\t\t\t"])),(l()(),t._4(70,0,null,null,1,"span",[["class","m-widget1__number m--font-brand"]],null,null,null,null,null)),(l()(),t._25(71,null,["\n                                              R$","\n\t\t\t\t\t\t\t\t\t"])),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._4(76,0,null,null,19,"div",[["class","m-widget1__item"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._4(78,0,null,null,16,"div",[["class","row m-row--no-padding align-items-center"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._4(80,0,null,null,7,"div",[["class","col-xs-10"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._4(82,0,null,null,1,"h3",[["class","m-widget1__title"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                        Vendas Di\xe1rias\n                                    "])),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._4(85,0,null,null,1,"span",[["class","m-widget1__desc"]],null,null,null,null,null)),(l()(),t._25(-1,null,["Valor total das vendas do dia"])),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._4(89,0,null,null,4,"div",[["class","col m--align-right"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n\t\t\t\t\t\t\t\t\t"])),(l()(),t._4(91,0,null,null,1,"span",[["class","m-widget1__number m--font-brand"]],null,null,null,null,null)),(l()(),t._25(92,null,["\n                                        R$","\n\t\t\t\t\t\t\t\t\t"])),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._25(-1,null,["\n                        "])),(l()(),t.Z(16777216,null,null,1,null,v)),t._3(98,16384,null,0,p.k,[t.N,t.K],{ngIf:[0,"ngIf"]},null),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._4(100,0,null,null,19,"div",[["class","m-widget1__item"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._4(102,0,null,null,16,"div",[["class","row m-row--no-padding align-items-center"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._4(104,0,null,null,7,"div",[["class","col-xs-10"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._4(106,0,null,null,1,"h3",[["class","m-widget1__title"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                     Total de Clientes Cadastrados\n                                    "])),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._4(109,0,null,null,1,"span",[["class","m-widget1__desc"]],null,null,null,null,null)),(l()(),t._25(-1,null,["Total de pedidos do dia"])),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._4(113,0,null,null,4,"div",[["class","col m--align-right"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n\t\t\t\t\t\t\t\t\t"])),(l()(),t._4(115,0,null,null,1,"span",[["class","m-widget1__number m--font-danger"]],null,null,null,null,null)),(l()(),t._25(116,null,["\n\t\t\t\t\t\t\t\t\t\t","\n\t\t\t\t\t\t\t\t\t"])),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._25(-1,null,["\n                  \n                    "])),(l()(),t._25(-1,null,["\n                    "])),(l()(),t._25(-1,null,["\n                "])),(l()(),t._25(-1,null,["\n                "])),(l()(),t._4(124,0,null,null,65,"div",[["class","col-xl-8"],["id","resumo-pedidos"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                    "])),(l()(),t._25(-1,null,["\n                    "])),(l()(),t._4(127,0,null,null,60,"div",[["class","m-widget14"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._4(129,0,null,null,7,"div",[["class","m-widget14__header"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._4(131,0,null,null,1,"h3",[["class","m-widget14__title"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                Resumo dos Pedidos\n                            "])),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._4(134,0,null,null,1,"span",[["class","m-widget14__desc"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n\t\t\t\t\t\t\t\tResumo dos Pedidos totais de uma distribuidora\n\t\t\t\t\t\t\t"])),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._4(138,0,null,null,48,"div",[["class","row  align-items-center"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._4(140,0,null,null,7,"div",[["class","col"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._4(142,0,null,null,4,"div",[["class","m-widget14__chart"],["id","m_chart_profit_share"],["style","height: 160px"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._4(144,0,null,null,1,"div",[["class","m-widget14__stat"]],null,null,null,null,null)),(l()(),t._25(145,null,["\n                                        ","\n                                    "])),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._4(149,0,null,null,36,"div",[["class","col"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._4(151,0,null,null,33,"div",[["class","m-widget14__legends"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._4(153,0,null,null,6,"div",[["class","m-widget14__legend"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                        "])),(l()(),t._4(155,0,null,null,0,"span",[["class","m-widget14__legend-bullet m--bg-info"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                        "])),(l()(),t._4(157,0,null,null,1,"span",[["class","m-widget14__legend-text"]],null,null,null,null,null)),(l()(),t._25(158,null,["\n                                            "," Pedidos\n\t\t\t\t\t\t\t\t\t\t"])),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._4(161,0,null,null,6,"div",[["class","m-widget14__legend"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                        "])),(l()(),t._4(163,0,null,null,0,"span",[["class","m-widget14__legend-bullet m--bg-success"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                        "])),(l()(),t._4(165,0,null,null,1,"span",[["class","m-widget14__legend-text"]],null,null,null,null,null)),(l()(),t._25(166,null,["\n\t\t\t\t\t\t\t\t\t\t\t"," Tickets Cancelados\n\t\t\t\t\t\t\t\t\t\t"])),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._4(169,0,null,null,6,"div",[["class","m-widget14__legend"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                        "])),(l()(),t._4(171,0,null,null,0,"span",[["class","m-widget14__legend-bullet m--bg-warning"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                        "])),(l()(),t._4(173,0,null,null,1,"span",[["class","m-widget14__legend-text"]],null,null,null,null,null)),(l()(),t._25(174,null,["\n\t\t\t\t\t\t\t\t\t\t\t"," Demandas pendentes/n\xe3o entregues\n\t\t\t\t\t\t\t\t\t\t"])),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._4(177,0,null,null,6,"div",[["class","m-widget14__legend"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                        "])),(l()(),t._4(179,0,null,null,0,"span",[["class","m-widget14__legend-bullet m--bg-danger"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                        "])),(l()(),t._4(181,0,null,null,1,"span",[["class","m-widget14__legend-text"]],null,null,null,null,null)),(l()(),t._25(182,null,["\n\t\t\t\t\t\t\t\t\t\t\t"," Demanda Cancelada\n\t\t\t\t\t\t\t\t\t\t"])),(l()(),t._25(-1,null,["\n                                    "])),(l()(),t._25(-1,null,["\n                                "])),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._25(-1,null,["\n                    "])),(l()(),t._25(-1,null,["\n                    "])),(l()(),t._25(-1,null,["\n\n                "])),(l()(),t._25(-1,null,["\n\n            "])),(l()(),t._25(-1,null,["\n        "])),(l()(),t._25(-1,null,["\n    "])),(l()(),t._25(-1,null,["\n\n\n    "])),(l()(),t._4(194,0,null,null,47,"div",[["class","m-portlet"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n        "])),(l()(),t._4(196,0,null,null,44,"div",[["class","m-portlet__body  m-portlet__body--no-padding"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n            "])),(l()(),t._4(198,0,null,null,41,"div",[["class","row m-row--no-padding m-row--col-separator-xl"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n\n                "])),(l()(),t._4(200,0,null,null,18,"div",[["class","col-xl-6"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n\n                    "])),(l()(),t._4(202,0,null,null,15,"div",[["class","m-widget14"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._4(204,0,null,null,7,"div",[["class","m-widget14__header m--margin-bottom-30"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._4(206,0,null,null,1,"h3",[["class","m-widget14__title"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                Vendas Di\xe1rias\n                            "])),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._4(209,0,null,null,1,"span",[["class","m-widget14__desc"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n\t\t\t\t\t\t\t\tVendas di\xe1rias em um intervalo semanal\n\t\t\t\t\t\t\t"])),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._4(213,0,null,null,3,"div",[["class","m-widget14__chart"],["style","height:180px;"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._4(215,0,null,null,0,"canvas",[["id","m_chart_daily_sales"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._25(-1,null,["\n                    "])),(l()(),t._25(-1,null,["\n\n                "])),(l()(),t._25(-1,null,["\n\n                "])),(l()(),t._4(220,0,null,null,18,"div",[["class","col-xl-6"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n\n                    "])),(l()(),t._4(222,0,null,null,15,"div",[["class","m-widget14"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._4(224,0,null,null,7,"div",[["class","m-widget14__header"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._4(226,0,null,null,1,"h3",[["class","m-widget14__title"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                                Vendas Mensais\n                            "])),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._4(229,0,null,null,1,"span",[["class","m-widget14__desc"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n\t\t\t\t\t\t\t\tVendas mensais em um intervalo anual\n\t\t\t\t\t\t\t"])),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._4(233,0,null,null,3,"div",[["class","m-widget4__chart m-portlet-fit--sides m--margin-top-10 m--margin-top-20"],["style","height:180px"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                            "])),(l()(),t._4(235,0,null,null,0,"canvas",[["id","m_chart_trends_stats"]],null,null,null,null,null)),(l()(),t._25(-1,null,["\n                        "])),(l()(),t._25(-1,null,["\n\n                    "])),(l()(),t._25(-1,null,["\n\n                "])),(l()(),t._25(-1,null,["\n            "])),(l()(),t._25(-1,null,["\n        "])),(l()(),t._25(-1,null,["\n\n    "])),(l()(),t._25(-1,null,["\n"]))],function(l,n){var u=n.component;l(n,14,0,"#"),l(n,98,0,"admin"==u.user.role)},function(l,n){var u=n.component;l(n,71,0,u.valorTotalVendas),l(n,92,0,u.valorTotalVendasDia),l(n,116,0,u.totalPedidosDia),l(n,145,0,u.totalUsers),l(n,158,0,u.totalUsers),l(n,166,0,u.totalUsers),l(n,174,0,u.totalUsers),l(n,182,0,u.totalUsers)})}var b=t._0("app-blank",r,function(l){return t._27(0,[(l()(),t._4(0,0,null,null,1,"app-blank",[],null,null,null,f,h)),t._3(1,4308992,null,0,r,[s.a,a.a,o.a,d.a,_.a],null,null)],function(l,n){l(n,1,0)},null)},{},{},[]),w=u("bfOx"),y=u("p2Z0");u.d(n,"BlankModuleNgFactory",function(){return C});var C=t._1(c,[],function(l){return t._12([t._13(512,t.j,t.X,[[8,[m.a,b]],[3,t.j],t.w]),t._13(4608,p.m,p.l,[t.t,[2,p.t]]),t._13(512,p.c,p.c,[]),t._13(512,w.p,w.p,[[2,w.u],[2,w.m]]),t._13(512,y.a,y.a,[]),t._13(512,c,c,[]),t._13(1024,w.k,function(){return[[{path:"",component:e.a,children:[{path:"",component:r}]}]]},[])])})}});