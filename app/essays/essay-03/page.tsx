import ProjectPageShell from '@/components/ProjectPageShell';
import AnimatedPage from '@/components/AnimatedPage';

export const essay03Metadata = {
  id: 'essay-03',
  title: "Tuesday night heartbreak",
  date: 'January 2026',
  cardDate: 'Jan 2026',
  cardDescription: 'The broken heart that comes from never letting yourself love at all.',
  href: '/essays/essay-03',
};

export default function Essay03() {
  const description = (
    <>
      <p className="mb-2 sm:mb-3">
        We talk about loneliness like it&apos;s a sudden thing—like it strikes when you&apos;re thirty-five and alone at dinner. But it&apos;s not. It&apos;s residue. Left behind from years of &quot;almost&quot; and &quot;close enough.&quot;
      </p>
      <p className="mb-2 sm:mb-3">
        There&apos;s a kind of broken heart nobody talks about. Not the kind from a breakup where someone leaves and you&apos;re left picking up the pieces. This one is quieter. This one builds slowly, from saying no to someone who would have loved you completely because they had the wrong job, the wrong look, the wrong background. From walking away from someone who was obsessed with you in the best way because they didn&apos;t fit the image in your head. From passing on someone who could have made you happy for the rest of your life because of some quirk or flaw that wouldn&apos;t have mattered six months in.
      </p>
      <p className="mb-2 sm:mb-3">
        You were choosing the fantasy of someone better over the reality of someone good. You were protecting yourself so well you forgot what you were protecting yourself for.
      </p>
      <p className="mb-2 sm:mb-3">
        Some people end up married but still carry this broken heart. They settled for someone safe while thinking about the one they passed on. Most don&apos;t even realize they&apos;re hurting till one anniversary, one quiet fight, and they catch their mind drifting to someone who wasn&apos;t &quot;the type,&quot; but somehow felt like oxygen. The broken heart followed them down the aisle.
      </p>
      <p className="mb-2 sm:mb-3">
        And then there are the ones who never made it that far. They wake up single one day and realize the protection became the problem. The possibility of connection starts to feel like a threat. Depression creeps in. They see the person they passed on with someone else and compare themselves. That hurts even more. They feel more isolated. It compounds.
      </p>
      <p className="mb-2 sm:mb-3">
        This is becoming more common. Maybe because we have more options now. The illusion of infinite choice making it easier to always think something better is around the corner. Maybe because it&apos;s easier to protect yourself when connection is optional.
      </p>
      <p>
        But the truth is harder than that. This is a broken heart that comes not from loving and losing, but from never letting yourself love at all.
      </p>
    </>
  );

  return (
    <AnimatedPage variant="dramatic">
      <ProjectPageShell
        title={essay03Metadata.title}
        date={essay03Metadata.date}
        description={description}
        backHref="/craft"
        backLabel="Craft"
        shareConfig={{
          title: `${essay03Metadata.title} — Ramin — Designer`,
          text: essay03Metadata.cardDescription,
        }}
      />
    </AnimatedPage>
  );
}

