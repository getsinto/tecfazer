import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { Folder, Calendar, ExternalLink } from 'lucide-react'

export default async function PortalProjectsPage({ params }: { params: { locale: string } }) {
  const session = await auth()
  const isPt = params.locale === 'pt'

  if (!session?.user?.email) return null

  const clientUser = await db.clientUser.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        orderBy: { createdAt: 'desc' },
      },
    },
  }).catch(() => null)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {isPt ? 'Meus Projetos' : 'My Projects'}
        </h1>
        <p className="text-gray-600">
          {isPt ? 'Acompanhe o progresso dos seus projetos' : 'Track the progress of your projects'}
        </p>
      </div>

      {clientUser && clientUser.projects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clientUser.projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-brand-teal to-brand-orange rounded-lg flex items-center justify-center">
                    <Folder className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{project.title}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(project.createdAt).toLocaleDateString(isPt ? 'pt-PT' : 'en-US')}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {isPt ? 'Ativo' : 'Active'}
                </span>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-2">
                {isPt ? project.descriptionPt : project.descriptionEn}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.categories.slice(0, 3).map((category) => (
                  <span key={category} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {category}
                  </span>
                ))}
              </div>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-teal hover:text-brand-orange transition-colors font-medium"
                >
                  {isPt ? 'Ver Projeto' : 'View Project'}
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">{isPt ? 'Nenhum projeto ainda' : 'No projects yet'}</h3>
          <p className="text-gray-600 mb-6">
            {isPt ? 'Quando iniciar um projeto, ele aparecerá aqui' : 'When you start a project, it will appear here'}
          </p>
          <a
            href={`/${params.locale}/contacto`}
            className="inline-block px-8 py-3 bg-gradient-to-r from-brand-teal to-brand-orange text-white font-bold rounded-lg hover:shadow-xl transition-all"
          >
            {isPt ? 'Iniciar Novo Projeto' : 'Start New Project'}
          </a>
        </div>
      )}
    </div>
  )
}
