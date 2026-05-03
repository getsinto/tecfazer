import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { FileText, Download } from 'lucide-react'

export default async function PortalDocumentsPage({ params }: { params: { locale: string } }) {
  const session = await auth()
  const isPt = params.locale === 'pt'

  if (!session?.user?.email) return null

  const clientUser = await db.clientUser.findUnique({
    where: { email: session.user.email },
    include: {
      documents: {
        orderBy: { uploadedAt: 'desc' },
      },
    },
  }).catch(() => null)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {isPt ? 'Meus Documentos' : 'My Documents'}
        </h1>
        <p className="text-gray-600">
          {isPt ? 'Aceda aos seus documentos e ficheiros' : 'Access your documents and files'}
        </p>
      </div>

      {clientUser && clientUser.documents.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  {isPt ? 'Nome' : 'Name'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  {isPt ? 'Tipo' : 'Type'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  {isPt ? 'Tamanho' : 'Size'}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  {isPt ? 'Data' : 'Date'}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {isPt ? 'Ações' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {clientUser.documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{doc.fileName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{doc.fileType}</td>
                  <td className="px-6 py-4 text-gray-600">{formatFileSize(doc.fileSize)}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(doc.uploadedAt).toLocaleDateString(isPt ? 'pt-PT' : 'en-US')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href={doc.fileUrl}
                      download
                      className="inline-flex items-center gap-2 text-brand-teal hover:text-brand-orange transition-colors font-medium"
                    >
                      <Download className="w-4 h-4" />
                      {isPt ? 'Descarregar' : 'Download'}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">{isPt ? 'Nenhum documento ainda' : 'No documents yet'}</h3>
          <p className="text-gray-600">
            {isPt ? 'Os seus documentos aparecerão aqui quando forem carregados' : 'Your documents will appear here when uploaded'}
          </p>
        </div>
      )}
    </div>
  )
}
