import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import PapaNoel3 from './PapaNoel3';
import Nutcracker from './Nutcracker';
import Snowman from './Snowman';
import Reno from './Reno';
import Elfo from './Elfo';

const Snowflake = ({ delay, duration, xStart, size }) => (
    <motion.div
        initial={{ y: -20, x: 0, opacity: 0, rotate: 0 }}
        animate={{
            y: '100vh',
            x: [0, Math.random() * 100 - 50, 0, Math.random() * 100 - 50],
            opacity: [0, 1, 1, 0],
            rotate: 360
        }}
        transition={{
            duration: duration,
            delay: delay,
            repeat: Infinity,
            ease: "linear"
        }}
        className="fixed top-0 text-blue-200 dark:text-white pointer-events-none z-50 select-none"
        style={{
            left: `${xStart}vw`,
            fontSize: `${size}px`,
            textShadow: '0 0 2px rgba(0,0,0,0.1)',
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))'
        }}
    >
        ❄
    </motion.div>
);

const ChristmasDecorations = () => {
    const [snowflakes, setSnowflakes] = useState([]);
    const [activeCharacter, setActiveCharacter] = useState(null);
    const [step, setStep] = useState(0);

    const specialChars = ['nutcracker', 'snowman', 'reno', 'elfo'];

    useEffect(() => {
        // CAMBIA EL 50 POR OTRO NÚMERO (ej. 100 para más nieve, 20 para menos)
        const flakes = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            delay: Math.random() * 5,
            duration: 8 + Math.random() * 10,
            xStart: Math.random() * 100,
            size: 10 + Math.random() * 15
        }));
        setSnowflakes(flakes);
    }, []);

    useEffect(() => {
        let hideTimer;
        let nextStepTimer;
        let startTimer;

        const runCycle = () => {
            let nextChar = '';

            if (step % 2 === 0) {
                // Turno de personaje especial
                const index = (step / 2) % specialChars.length;
                nextChar = specialChars[index];
            } else {
                // Turno de Papa Noel
                nextChar = 'papanoel3';
            }

            setActiveCharacter(nextChar);

            // Ocultar personaje después de 5 segundos
            hideTimer = setTimeout(() => {
                setActiveCharacter(null);
            }, 5000);

            // Programar el siguiente paso: 5s visible + 15s espera = 20s total
            nextStepTimer = setTimeout(() => {
                setStep(prev => prev + 1);
            }, 20000);
        };

        // Pequeño retraso inicial solo para el primer paso
        if (step === 0) {
            startTimer = setTimeout(runCycle, 2000);
        } else {
            runCycle();
        }

        return () => {
            clearTimeout(startTimer);
            clearTimeout(hideTimer);
            clearTimeout(nextStepTimer);
        };
    }, [step]);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {snowflakes.map((flake) => (
                <Snowflake
                    key={flake.id}
                    delay={flake.delay}
                    duration={flake.duration}
                    xStart={flake.xStart}
                    size={flake.size}
                />
            ))}


            <PapaNoel3 isVisible={activeCharacter === 'papanoel3'} />
            <Nutcracker isVisible={activeCharacter === 'nutcracker'} />
            <Snowman isVisible={activeCharacter === 'snowman'} />
            <Reno isVisible={activeCharacter === 'reno'} />
            <Elfo isVisible={activeCharacter === 'elfo'} />
        </div>
    );
};

export default ChristmasDecorations;
