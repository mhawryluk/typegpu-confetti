import { type ReactNode, useRef, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import tgpu from 'typegpu';
import Confetti, {
  ConfettiProvider,
  type ConfettiRef,
  gravityFn,
  initParticleFn,
  useConfetti,
} from 'typegpu-confetti';
import * as d from 'typegpu/data';
import * as std from 'typegpu/std';
import { rand01, setupRandomSeed } from './random';

const t = tgpu;

const centerGravity = gravityFn.does((pos) =>
  std.mul(2, d.vec2f(-pos.x, -pos.y)),
);
const rightGravity = gravityFn.does((pos) => d.vec2f(2.5, 0));
const upGravity = gravityFn.does((pos) => d.vec2f(0, 0.5));
const strongGravity = gravityFn.does((pos) => d.vec2f(0, -3));

const pointInitParticle = initParticleFn
  .does(/* wgsl */ `(i: i32) {
    setupRandomSeed(vec2f(f32(i), f32(i)));
    particleData[i].age = maxDurationTime * 1000;
    particleData[i].position = vec2f(
      (2 * rand01() - 1) / 2 / 50,
      (2 * rand01() - 1) / 2 / 50,
    );
    particleData[i].velocity = vec2f(
      50 * ((rand01() * 2 - 1) / 35 / 0.5),
      50 * ((rand01() * 2 - 1) / 30 + 0.05),
    );
    particleData[i].seed = rand01();
  }`)
  .$uses({ setupRandomSeed, rand01 });

export default function App() {
  return (
    <ConfettiProvider>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          backgroundColor: 'rgb(239 239 249)',
        }}
      >
        <Text
          style={{
            fontWeight: 900,
            fontSize: 25,
            textAlign: 'left',
            paddingLeft: '10%',
            paddingBottom: 40,
            fontStyle: 'italic',
            width: '100%',
            color: 'rgb(82 89 238)',
          }}
        >
          typegpu-confetti
        </Text>
        <View style={styles.container}>
          <ConfettiContextButton />

          <ButtonRow label="Color" icon="💜">
            <Confetti
              colorPalette={[
                [68, 23, 82, 1],
                [129, 116, 160, 1],
                [168, 136, 181, 1],
                [239, 182, 200, 1],
              ]}
            />
          </ButtonRow>

          <ButtonRow label="Amount" icon="▫️">
            <Confetti initParticleAmount={50} />
          </ButtonRow>

          <ButtonRow label="Amount" icon="⬜️">
            <Confetti initParticleAmount={1000} maxParticleAmount={1000} />
          </ButtonRow>

          <ButtonRow label="Size" icon="▪️">
            <Confetti size={0.5} />
          </ButtonRow>

          <ButtonRow label="Size" icon="⬛️">
            <Confetti size={1.5} />
          </ButtonRow>

          <ButtonRow label="Color, Size, Amount" icon="🌨️">
            <Confetti
              colorPalette={[[255, 255, 255, 0.8]]}
              size={0.5}
              initParticleAmount={400}
            />
          </ButtonRow>

          <ButtonRow label="Gravity" icon="➡️">
            <Confetti gravity={rightGravity} />
          </ButtonRow>

          <ButtonRow label="Gravity" icon="⬆️">
            <Confetti gravity={upGravity} maxDurationTime={5} />
          </ButtonRow>

          <ButtonRow label="Gravity" icon="↕️">
            <Confetti gravity={centerGravity} maxDurationTime={5} />
          </ButtonRow>

          <ButtonRow label="Initial state, Gravity" icon="💣">
            <Confetti
              initParticle={pointInitParticle}
              gravity={strongGravity}
            />
          </ButtonRow>

          <ImperativeConfettiButtonRow label="Imperative" icon="🏛️" />
        </View>
      </SafeAreaView>
    </ConfettiProvider>
  );
}

function ConfettiContextButton() {
  const confetti = useConfetti();

  return (
    <Pressable
      onPress={() => confetti.rerun()}
      onLongPress={() => confetti.dispose()}
      style={{
        borderRadius: 20,
        backgroundColor: 'rgb(82 89 238)',
        padding: 15,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 25 }}>🌨️</Text>
        <Text style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>
          Default (using hook)
        </Text>
      </View>
    </Pressable>
  );
}

function ButtonRow({
  icon,
  label,
  children,
}: { icon?: string; label?: string; children: ReactNode }) {
  const [confettiKey, setConfettiKey] = useState(0);
  return (
    <>
      <Pressable
        onPress={() => setConfettiKey((key) => key + 1)}
        onLongPress={() => setConfettiKey(0)}
        style={{
          borderRadius: 20,
          backgroundColor: 'rgb(82 89 238)',
          padding: 15,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 25 }}>{icon ?? '🎉'} </Text>
          <Text style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>
            {label}
          </Text>
        </View>
      </Pressable>

      {confettiKey > 0 && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            pointerEvents: 'none',
            cursor: 'auto',
            zIndex: 1,
          }}
          key={confettiKey}
        >
          {children}
        </View>
      )}
    </>
  );
}

function ImperativeConfettiButtonRow({
  icon,
  label,
}: { icon?: string; label?: string }) {
  const confettiRef = useRef<ConfettiRef>(null);

  return (
    <>
      <Pressable
        onPress={() => confettiRef.current?.addParticles(50)}
        style={{
          borderRadius: 20,
          backgroundColor: 'rgb(82 89 238)',
          padding: 15,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 25 }}>{icon ?? '🎉'} </Text>
          <Text style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>
            {label}
          </Text>
        </View>
      </Pressable>

      <Confetti
        ref={confettiRef}
        initParticleAmount={0}
        maxParticleAmount={1000}
        maxDurationTime={2}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    position: 'static',
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
});
