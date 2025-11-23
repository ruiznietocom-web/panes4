import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

import PantoMateImg from '../assets/images/pantomate.jpg';
import BarrasPan from '../assets/images/barras.jpg';
import PantoMate from '../assets/images/pantomateb.jpg';
import BollosPulguitas from '../assets/images/bollopulga.jpg';
import CorazonHarina from '../assets/images/corazon.jpg';
import PandeAjo from '../assets/images/panajo.jpg';
import PandeCacao from '../assets/images/pancacao.jpg';
import PandeOliva from '../assets/images/panoliva.jpg';
import Pulguitascenteno from '../assets/images/pulguitas.jpg';
import Bolloswenos from '../assets/images/bollos.jpg';

const InformacionPage = () => {
  return (
    <motion.div
      className="max-w-4xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl transition-colors duration-300 border border-amber-50 dark:border-slate-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white font-serif border-b-2 border-amber-100 dark:border-slate-600 pb-4">
        + INFORMACIÓN
      </h1>

      {/* BOTÓN PARA DESCARGAR PDF AL PRINCIPIO */}
      <div className="my-8 flex justify-center">
        <a
          href="/docs/PRECIOS PANES INTEGRALES 30 11 2025.pdf"
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 
                     text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:from-green-700 hover:to-green-800
                     transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          <Download className="w-6 h-6" />
          Descargar PDF de Precios
        </a>
      </div>

      <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed font-sans text-lg">
        <p className="font-serif text-xl text-amber-700 dark:text-amber-500 text-center italic">
          "Redescubriendo el pan, un alimento con alma."
        </p>

        <p>
          ¿Y si te dijera que el pan puede ser mucho más que un simple acompañamiento? En un mundo lleno de prisa, hemos olvidado la conexión profunda que existe entre el alimento más básico y nuestra salud. Te invito a redescubrir el pan de verdad, ese que honra la tradición, respeta la tierra y nutre tu cuerpo de una forma consciente.
        </p>

        <p>
          Los panes, bollitos y pulguitas no son solo productos, son el fruto de un trabajo pensado para que tu organismo absorba los nutrientes de la forma más equilibrada posible. Cada pieza es 100% integral y está elaborada con harinas de cultivo ecológico, libres de cualquier tipo de aditivos. Aquí no hay espacio para harinas de fuerza o refinadas, ni para conservantes, grasas industriales o mejorantes panarios. Simplemente de trata de regresar a los orígenes.
        </p>

        {/* Imagen dentro del contenido */}
        <div className="my-8 flex justify-center">
          <img
            src={PantoMateImg}
            alt="Pan de tomate"
            className="w-full max-w-md rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
          />
        </div>

        <p>
          La receta de este pan es un pacto de pureza: solo utilizo sal marina natural de nuestras salinas de Chiclana, agua mineral, levadura fresca y harina 100% integral de cultivo ecológico. A esto, le sumamos, a elección, otros ingredientes como pasas, nueces o miel pura de abejas, que aportan sabor y bienestar tambien de forma natural.
        </p>

        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4 font-serif">
          El poder de la fermentación corta
        </h3>

        <p>
          Este es el verdadero corazón del proceso de elaboración y la clave de un pan que te sienta bien de verdad. Más allá de usar ingredientes de alta calidad, el secreto está en la fermentación corta y controlada. Este proceso, sacrificado en la producción industrial, es fundamental para tu digestión.
        </p>

        <p>
          Nuestro cuerpo tienen su propio sistema de procesamiento: las amilasas, unas enzimas presentes en la saliva y el tracto digestivo, son las encargadas de descomponer los almidones. Cuando un pan tiene una fermentación muy larga, se vuelve excesivamente ácido, lo que puede inhibir la acción de estas enzimas naturales.
        </p>

        <p>
          Al optar por una fermentación más corta, obtenemos un pan con una acidez baja que respeta el funcionamiento digestivo y equilibrado de tu organismo. Es como darle a tu sistema digestivo una mano, no un obstáculo. Esto se traduce en una mejor asimilación de los almidones y en una sensación de ligereza y bienestar después de comer. No es solo un pan más digestivo, es un pan que trabaja en armonía con tu cuerpo.
        </p>

        {/* Imagen dentro del contenido */}
        <div className="my-8 flex justify-center">
          <img
            src={BarrasPan}
            alt="Barras"
            className="w-full max-w-md rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
          />
        </div>

        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4 font-serif border-b border-amber-100 dark:border-slate-700 pb-2 inline-block">
          CONOCE LAS HARINAS
        </h3>

        <ul className="space-y-4">
          <li className="bg-amber-50 dark:bg-slate-700/50 p-4 rounded-xl border border-amber-100 dark:border-slate-600">
            <strong className="text-amber-800 dark:text-amber-400 block mb-2 font-serif text-lg">1. Espelta</strong>
            Es un trigo primitivo, cuyas propiedades son bien conocidas y apreciadas desde antiguo en Europa.
            Su valor nutritivo es comparable al de la avena. Es rica en proteínas, carbohidratos, sales minerales y
            vitaminas A, B y E, así como magnesio, fósforo, hierro y potasio. Su consumo diario reduce los niveles de
            colesterol y regula el metabolismo. Ofrece mayor cantidad de aminoácidos esenciales que el trigo común y
            también lo supera en riqueza vitamínica y minerales. Algunas personas alérgicas al trigo digieren bien la espelta.
          </li>

          <li className="bg-amber-50 dark:bg-slate-700/50 p-4 rounded-xl border border-amber-100 dark:border-slate-600">
            <strong className="text-amber-800 dark:text-amber-400 block mb-2 font-serif text-lg">2. Khorasan</strong>
            Es un trigo ancestral de Egipto, rico en sales minerales y vitaminas del grupo B. Muy apreciado porque es bajo en gluten
            y produce menos alergias o intolerancias que los trigos modernos, ya que el organismo humano está más adaptado al tipo de proteína de los trigos antiguos.
          </li>

          <li className="bg-amber-50 dark:bg-slate-700/50 p-4 rounded-xl border border-amber-100 dark:border-slate-600">
            <strong className="text-amber-800 dark:text-amber-400 block mb-2 font-serif text-lg">3. Trigo Integral</strong>
            El trigo procesado (refinado) no contiene las mejores partes del grano. Durante el procesamiento del grano se elimina el 40% de su contenido original (germen y salvado),
            quedando principalmente los hidratos de carbono (azúcares) del endospermo, lo que lo hace ser menos nutritivo. Al conservar el salvado y el germen de trigo,
            la harina de trigo integral se destaca por una cantidad de fibra 3 veces superior a la harina blanca refinada, además tiene un alto contenido de vitaminas y minerales,
            como vitaminas del complejo B, vitamina E, hierro, potasio, magnesio, zinc, entre otros.
          </li>

          <li className="bg-amber-50 dark:bg-slate-700/50 p-4 rounded-xl border border-amber-100 dark:border-slate-600">
            <strong className="text-amber-800 dark:text-amber-400 block mb-2 font-serif text-lg">4. Centeno</strong>
            Además de los minerales, vitaminas, magnesio, fósforo y fibra que aporta, es un cereal muy apreciado por sus propiedades depurativas de la sangre y
            por ayudar a mantener la elasticidad de los vasos sanguíneos.
          </li>

          <li className="bg-amber-50 dark:bg-slate-700/50 p-4 rounded-xl border border-amber-100 dark:border-slate-600">
            <strong className="text-amber-800 dark:text-amber-400 block mb-2 font-serif text-lg">5. Tritordeum</strong>
            Es un cereal híbrido nacido de la combinación natural del trigo duro y una cebada silvestre. Fue descubierto por investigadores españoles a finales de los años 70.
            NO es un organismo modificado genéticamente (OGM). Es el resultado de un cruce natural. Y está registrado como nueva especie en la Unión Europea.
            Tiene un sabor ligeramente dulce, con un contenido alto en ácido oleico y luteína, además tiene un 30% más de fibra que el trigo común.
          </li>
        </ul>

        {/* Imagen dentro del contenido */}
        <div className="my-8 flex justify-center">
          <img
            src={PantoMate}
            alt="Pan tomate"
            className="w-full max-w-md rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
          />
        </div>

        <p>
          <strong className="text-amber-700 dark:text-amber-500">Levadura natural o fresca:</strong> a diferencia de la levadura química en polvo, es de origen biológico, un hongo microscópico vivo y activo.
          Se vende en supermercados como levadura fresca, natural o de panadería.
        </p>

        <p>
          La <strong className="text-amber-700 dark:text-amber-500">sal marina natural</strong> no ha sido tratada químicamente: es la consecuencia de la simple evaporación del agua de mar.
          Por supuesto que un 90% de su composición es cloro y sodio de forma natural, pero contiene un mayor número de oligoelementos, minerales y yodo que son de gran relevancia nutricional para el cuerpo.
          Tomar sal marina no refinada en cantidades moderadas contribuye a un buen drenaje de toxinas, eleva la vitalidad, favorece el funcionamiento de los riñones, mejora la sexualidad y reconstituye huesos y pelo,
          además, mejora la digestión favoreciendo la generación de jugos gástricos.
        </p>

        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4 font-serif">
          El compromiso del panadero artesanal
        </h3>

        <p>
          Detrás de cada pieza, hay horas de dedicación y la pasión por un oficio ancestral. No se trata solo de mezclar ingredientes, sino de un proceso de paciencia, de sentir la masa y de entender sus tiempos. La elaboración artesanal garantiza que cada pan que llega a tu mesa es único, con un sabor auténtico y una textura inigualable.
        </p>

        <p>
          Este pan es para ti si buscas una opción consciente y nutritiva que apoye un estilo de vida más saludable y sostenible, alejado de esas digestiones pesadas y fermentativas. Descubre el placer de comer bien sin renunciar al sabor ni a la calidad, y siente la diferencia en un alimento tan nutritivo.
        </p>

        <p className="font-serif text-lg text-center text-amber-800 dark:text-amber-400 italic my-8 bg-amber-50 dark:bg-slate-700/30 p-6 rounded-xl">
          Muchísimas gracias por confiar en este proyecto. Disfruto horneando para ti y espero que tambien disfrutes de cada rebanada con salud y alegría. 🍞 🙏☀️
        </p>

        <p className="text-center font-bold text-lg">
          Si necesitas más información en contacta conmigo en mi wasap <span className="text-green-600 dark:text-green-400">627-52-63-80</span>.
        </p>

        {/* Imagen dentro del contenido */}
        <div className="my-8 flex justify-center">
          <img
            src={BollosPulguitas}
            alt="Bollo Pulguita"
            className="w-full max-w-md rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
          />
        </div>

        <div className="border-t-2 border-dashed border-gray-300 dark:border-slate-600 my-8"></div>

        <h3 className="text-2xl font-bold text-center text-amber-700 dark:text-amber-500 mb-6 font-serif">
          🍞 Consejos para una óptima conservación del pan integral ecológico 🍞
        </h3>

        <div className="bg-blue-50 dark:bg-slate-700/50 p-6 rounded-xl border border-blue-100 dark:border-slate-600 space-y-4">
          <p>
            Como sabéis, este pan 100% ecológico e integral está libre de conservantes y añadidos artificiales. La mejor forma para conservar el pan es en el frigorífico. Consérvalo dentro en la misma bolsa de papel y ésta a su vez en una bolsa de plástico bien cerrada. Colócalo, preferentemente, en la bandeja más alta de tu frigorífico, allí puede aguantar hasta 3 ó 4 días perfectamente. Luego es preferible que congeles el resto que no hayas consumido.
          </p>
          <p>
            Si prefieres, también puedes cortarlo en rodajas o en porciones que vayas a consumir y congelarlo directamente el día de la entrega, siempre en una bolsa o un táper bien cerrado para que no genere escarcha.
          </p>
          <p className="font-semibold text-blue-800 dark:text-blue-300">
            El pan, los bollitos o pulguitas se entregan siempre hechos del día, y algunas veces aún calentitos, si es así, deposítalo en la rejilla del horno y espera siempre una hora desde la entrega para consumirlo. No lo guardes o congeles en el frigorífico hasta que notes que está completamente frío. Gracias!! 🙏
          </p>
        </div>

        {/* Galería de imágenes final */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          <img src={CorazonHarina} alt="Corazon de Harina" className="rounded-lg shadow-md hover:scale-105 transition-transform" />
          <img src={Bolloswenos} alt="Bollitos" className="rounded-lg shadow-md hover:scale-105 transition-transform" />
          <img src={PandeAjo} alt="Pan Ajo" className="rounded-lg shadow-md hover:scale-105 transition-transform" />
          <img src={PandeCacao} alt="Pan Cacao" className="rounded-lg shadow-md hover:scale-105 transition-transform" />
          <img src={PandeOliva} alt="Pan Oliva" className="rounded-lg shadow-md hover:scale-105 transition-transform" />
          <img src={Pulguitascenteno} alt="Pulguitas" className="rounded-lg shadow-md hover:scale-105 transition-transform" />
        </div>

      </div>
    </motion.div>
  );
};

export default InformacionPage;
