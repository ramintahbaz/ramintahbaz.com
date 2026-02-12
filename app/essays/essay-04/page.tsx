import ProjectPageShell from '@/components/ProjectPageShell';
import AnimatedPage from '@/components/AnimatedPage';

export const essay04Metadata = {
  id: 'essay-04',
  title: 'The Great Flattening',
  date: 'February 2026',
  cardDate: 'Feb 2026',
  cardDescription: "Everyone can do everything now, and it's making us worse.",
  href: '/essays/essay-04',
};

export default function Essay04() {
  const description = (
    <>
      <p className="mb-2 sm:mb-3">
        Everyone can do everything now, and it&apos;s making us worse.
      </p>
      <p className="mb-2 sm:mb-3">
        PMs who learn to prompt think they&apos;ve learned to design. Designers who generate code think they&apos;ve learned to build. Developers who architect features think they&apos;ve learned to product. Everyone&apos;s reaching across boundaries that used to require depth to cross, armed with nothing but confidence and a chatbot.
      </p>
      <p className="mb-2 sm:mb-3">
        This impulse isn&apos;t new. Putting a camera in everyone&apos;s pocket didn&apos;t make us all photographers. It just made us all think we were.
      </p>
      <p className="mb-2 sm:mb-3">
        What made great product teams work wasn&apos;t division of labor—it was respect for what lay on the other side of the wall. Developers who understood they couldn&apos;t pixel-push their way to beauty. Designers who knew their Figma prototypes weren&apos;t technical architecture. PMs who recognized that knowing what to build isn&apos;t the same as knowing how.
      </p>
      <p className="mb-2 sm:mb-3">
        These tools are powerful. They do collapse timelines. A designer can ship a working prototype now. A developer can mock up interfaces that don&apos;t look broken. A PM can explore technical approaches without waiting for a sprint. This is real progress.
      </p>
      <p className="mb-2 sm:mb-3">
        But somewhere in that acceleration, collaboration turned into competition. Your coworker isn&apos;t your complement anymore—they&apos;re your threat. I can do your job now. You&apos;re not special. Watch me. Tools that were supposed to make us powerful have made us paranoid instead.
      </p>
      <p className="mb-2 sm:mb-3">
        Craft dissolves. Respect dissolves. What&apos;s left is a workplace of people who&apos;ve mistaken capability for mastery, each one convinced AI has closed a gap that actually runs deeper than they realize.
      </p>
      <p className="mb-2 sm:mb-3">
        But here&apos;s what they&apos;re missing, what no amount of prompting can teach: taste isn&apos;t a skill you acquire. It&apos;s not in the training data. You either see it or you don&apos;t. You either feel the wrongness of a bad gradient, the weight of a clumsy interaction, the hollowness of a feature nobody wanted—or you don&apos;t.
      </p>
      <p>
        These tools can&apos;t give you that. They can only reveal who never had it to begin with.
      </p>
    </>
  );

  return (
    <AnimatedPage variant="dramatic">
      <ProjectPageShell
        title={essay04Metadata.title}
        date={essay04Metadata.date}
        description={description}
        backHref="/craft"
        backLabel="Craft"
        shareConfig={{
          title: `${essay04Metadata.title} — Ramin — Designer`,
          text: essay04Metadata.cardDescription,
        }}
      />
    </AnimatedPage>
  );
}
