import Typography from '@mui/material/Typography'
import Section from '../component/section'
import Table from '../component/table'

const Playoff = () => (
  <Section>
    <div>
      <Typography variant="h1">Règles durant la phase finale</Typography>
      <p>
        Le fonctionnement des paris à partir de ce niveau de la compétition est
        identique à celui de la phase de groupe, à un détail près,
        <b> le score final est celui au bout de 80 minutes</b>. Néanmoins, en
        cas de match nul, il faut préciser le vainqueur en cas de prolongation,
        voire tirs au but. Vous gagnerez ainsi des points si vous avez au moins
        le bon vainqueur (voir plus grâce à la proximité au score car les scores
        nuls rentrent en compte).
      </p>
    </div>
    <div>
      <p>
        <u>Exemple pour un match de quart de finale Irlande-Italie</u> :
      </p>
      <br />
      <div className="table_section">
        <Table
          header={[
            'Type de résultat',
            'Score pronostiqués',
            'Cote du résultat',
            'Vainqueur pronostiqué',
            'Score réel',
            'Vainqueur réel',
            'Points gagnés',
          ]}
          rows={[
            [
              'Bon score',
              <div>
                <div>50-40</div>
              </div>,
              <div>
                <div>320</div>
              </div>,
              <div>
                <div>Irlande</div>
              </div>,
              <div>
                <div>50-40</div>
              </div>,
              <div>
                <div>Irlande</div>
              </div>,
              <div>
                <div>320</div>
              </div>,
            ],
            [
              'Bon résultat',
              <div>
                <div>40-40</div>
              </div>,
              <div>
                <div>320</div>
              </div>,
              <div>
                <div>Irlande</div>
              </div>,
              <div>
                <div>50-40</div>
              </div>,
              <div>
                <div>Irlande</div>
              </div>,
              <div>
                <div>320 - |50-40| = 310</div>
              </div>,
            ],
            [
              'Bon résultat',
              <div>
                <div>30-10</div>
              </div>,
              <div>
                <div>320</div>
              </div>,
              <div>
                <div>Irlande</div>
              </div>,
              <div>
                <div>50-40</div>
              </div>,
              <div>
                <div>Irlande</div>
              </div>,
              <div>
                <div>320 - |50-30| - |40-30| = 290</div>
              </div>,
            ],
            [
              'Mauvais vainqueur',
              <div>
                <div>10-20</div>
              </div>,
              <div>
                <div>600</div>
              </div>,
              <div>
                <div>Italie</div>
              </div>,
              <div>
                <div>50-40</div>
              </div>,
              <div>
                <div>Irlande</div>
              </div>,
              <div>
                <div>0</div>
              </div>,
            ],
          ]}
        />
      </div>
    </div>
  </Section>
)

export default Playoff
