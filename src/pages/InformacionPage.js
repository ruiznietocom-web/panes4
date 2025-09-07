import React from 'react';
import PantoMateImg from '../assets/images/pantomate.jpg'; // Ajusta la ruta según tu estructura

const InformacionPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">+ INFORMACIÓN</h1>

      <p>
        Todos los panes, bollitos y pulguitas son 100% integrales de harinas de cultivo ecológico, 
        sin más harina de fuerza ni refinada añadidas y sin conservantes, ni grasas animales ni vegetales, 
        ni mejorantes panarios. Los únicos ingredientes son: sal marina natural (no refinada), agua mineral, 
        levadura fresca y harina 100% integral de cultivo ecológico + añadidos (dátiles, pasas, ciruelas pasas, 
        nueces, miel natural pura de abejas...).
      </p>

      {/* Imagen dentro del contenido */}
      <div className="my-6 flex justify-center">
        <img 
          src={PantoMateImg} 
          alt="Pan de tomate" 
          className="w-full max-w-md rounded-lg shadow-md"
        />
      </div>

      <p>
        El pan forma parte imprescindible de una dieta equilibrada, pero debido al ritmo de vida actual 
        y a la introducción en el mercado de panes más comerciales e industriales, hemos ido olvidando la importancia 
        de cuidar un alimento tan importante para nuestra salud. El pan integral de harinas de cultivo ecológico 
        y poco fermentado que se ofrece es todo 100% natural, ninguno de sus ingredientes es de origen industrial, 
        obteniendo así un alimento sano y completo que aporta en su totalidad todo el sabor y los nutrientes originales 
        de los cereales integrales. Dedicado a quienes son conscientes de lo valioso que es disfrutar de una 
        alimentación saludable, y del pan natural de verdad.
      </p>

      <p>
        <strong>CONOCE LAS HARINAS</strong>:
      </p>

      <p>
        La <strong>Espelta</strong> es un trigo primitivo, cuyas propiedades son bien conocidas y apreciadas desde antiguo en Europa. 
        Su valor nutritivo es comparable al de la avena. Es rica en proteínas, carbohidratos, sales minerales y 
        vitaminas A, B y E, así como magnesio, fósforo, hierro y potasio. Su consumo diario reduce los niveles de 
        colesterol y regula el metabolismo. Ofrece mayor cantidad de aminoácidos esenciales que el trigo común y 
        también lo supera en riqueza vitamínica y minerales. Algunas personas alérgicas al trigo digieren bien la espelta.
      </p>

      <p>
        El <strong>Khorasan</strong> es un trigo ancestral de Egipto, rico en sales minerales y vitaminas del grupo B. Muy apreciado porque es bajo en gluten 
        y produce menos alergias o intolerancias que los trigos modernos, ya que el organismo humano está más adaptado al tipo de proteína de los trigos antiguos.
      </p>

      <p>
        El trigo procesado (refinado) no contiene las mejores partes del grano. Durante el procesamiento del grano se elimina el 40% de su contenido original (germen y salvado), 
        quedando principalmente los hidratos de carbono (azúcares) del endospermo, lo que lo hace ser menos nutritivo. Al conservar el salvado y el germen de trigo, 
        la harina de <strong>trigo</strong> integral se destaca por una cantidad de fibra 3 veces superior a la harina blanca refinada, además tiene un alto contenido de vitaminas y minerales, 
        como vitaminas del complejo B, vitamina E, hierro, potasio, magnesio, zinc, entre otros.
      </p>

      <p>
        El <strong>centeno</strong>, además de los minerales, vitaminas, magnesio, fósforo y fibra que aporta, es un cereal muy apreciado por sus propiedades depurativas de la sangre y 
        por ayudar a mantener la elasticidad de los vasos sanguíneos.
      </p>

      <p>
        El <strong>tritordeum</strong> es un cereal híbrido nacido de la combinación natural del trigo duro y una cebada silvestre. Fue descubierto por investigadores españoles a finales de los años 70. 
        NO es un organismo modificado genéticamente (OGM). Es el resultado de un cruce natural. Y está registrado como nueva especie en la Unión Europea. 
        Tiene un sabor ligeramente dulce, con un contenido alto en ácido oleico y luteína, además tiene un 30% más de fibra que el trigo común.
      </p>

      <p>
        <strong>Levadura natural o fresca</strong>, a diferencia de la levadura química en polvo, es de origen biológico, un hongo microscópico vivo y activo. 
        Se vende en supermercados como levadura fresca, natural o de panadería.
      </p>

      <p>
        La <strong>sal marina natural</strong> no ha sido tratada químicamente: es la consecuencia de la simple evaporación del agua de mar. 
        Por supuesto que un 90% de su composición es cloro y sodio de forma natural, pero contiene un mayor número de oligoelementos, minerales y yodo que son de gran relevancia nutricional para el cuerpo. 
        Tomar sal marina no refinada en cantidades moderadas contribuye a un buen drenaje de toxinas, eleva la vitalidad, favorece el funcionamiento de los riñones, mejora la sexualidad y reconstituye huesos y pelo, 
        además, mejora la digestión favoreciendo la generación de jugos gástricos.
      </p>
    </div>
  );
};

export default InformacionPage;
