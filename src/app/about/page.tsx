export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              關於向上建設
            </h1>
            <div className="h-1 w-16 bg-gray-900 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              致力於創造高品質住宅空間的專業建築設計團隊，
              以創新思維與專業技術，實現每一個居住夢想。
            </p>
          </div>
        </div>
      </section>

      {/* Company Mission */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-8 tracking-tight">
                我們的使命
              </h2>
              <div className="h-1 w-16 bg-gray-900 mb-8"></div>
              <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                向上建設成立於2018年，專精於住宅建築設計領域。
                我們深信每個家庭都值得擁有一個完美的居住空間，
                因此我們致力於將專業的設計理念與實用的生活需求完美結合。
              </p>
              <p className="text-lg text-gray-600 font-light leading-relaxed mb-8">
                我們的團隊由資深建築師、室內設計師和工程專家組成，
                每個項目都經過細膩的規劃與精心的執行，
                確保為客戶打造出既美觀又實用的理想住宅。
              </p>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                從概念發想到完工交付，我們提供全方位的建築設計服務，
                秉持著「品質至上，客戶第一」的經營理念，
                為每位客戶創造超越期待的居住體驗。
              </p>
            </div>
            <div className="bg-gray-200 aspect-[4/3] rounded-sm flex items-center justify-center">
              <span className="text-gray-400 font-light text-lg">公司形象圖片</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6 tracking-tight">
              核心價值
            </h2>
            <div className="h-1 w-16 bg-gray-900 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              我們的核心價值指導著每一個設計決策，
              確保為客戶提供最優質的建築設計服務。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-gray-900 mb-4 tracking-wide">
                創新設計
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                持續追求創新的設計理念，
                結合國際趨勢與在地文化，
                為每個項目注入獨特的設計靈魂。
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-gray-900 mb-4 tracking-wide">
                品質保證
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                嚴格的品質管控標準，
                從材料選擇到施工工藝，
                每個環節都力求完美，確保最高品質。
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-gray-900 mb-4 tracking-wide">
                客戶至上
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                以客戶需求為出發點，
                提供個人化的設計方案與專業建議，
                打造專屬的理想居住空間。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6 tracking-tight">
              專業團隊
            </h2>
            <div className="h-1 w-16 bg-gray-900 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              我們的專業團隊擁有豐富的建築設計經驗，
              致力於為每位客戶提供最優質的服務。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                name: "林建築師",
                position: "主持建築師",
                description: "擁有20年建築設計經驗，專精於現代住宅設計，曾獲得多項建築設計獎項。"
              },
              {
                name: "張設計師",
                position: "資深室內設計師",
                description: "15年室內設計經驗，擅長空間規劃與材質搭配，為客戶創造舒適的居住環境。"
              },
              {
                name: "王工程師",
                position: "結構工程師",
                description: "結構工程專家，確保每個建築項目的安全性與穩定性，注重工程品質與施工效率。"
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-8 flex items-center justify-center">
                  <span className="text-gray-400 font-light">團隊成員照片</span>
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-2 tracking-wide">
                  {member.name}
                </h3>
                <p className="text-gray-500 font-light mb-4 text-sm uppercase tracking-wider">
                  {member.position}
                </p>
                <p className="text-gray-600 font-light leading-relaxed text-sm">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6 tracking-tight">
              公司發展歷程
            </h2>
            <div className="h-1 w-16 bg-gray-900 mx-auto mb-8"></div>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-300"></div>
            
            <div className="space-y-16">
              {[
                {
                  year: "2018",
                  title: "公司成立",
                  description: "向上建設正式成立，專注於住宅建築設計服務。"
                },
                {
                  year: "2020",
                  title: "業務擴展",
                  description: "團隊擴充至15人，完成第50個住宅設計項目。"
                },
                {
                  year: "2022",
                  title: "獲得認證",
                  description: "獲得綠建築設計認證，致力於永續建築發展。"
                },
                {
                  year: "2024",
                  title: "持續成長",
                  description: "累計完成超過100個住宅項目，建立良好市場口碑。"
                }
              ].map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white p-8 rounded-sm shadow-sm">
                      <div className={`text-2xl font-light text-gray-900 mb-2 tracking-tight ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                        {milestone.year}
                      </div>
                      <h3 className={`text-lg font-light text-gray-900 mb-4 tracking-wide ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                        {milestone.title}
                      </h3>
                      <p className={`text-gray-600 font-light leading-relaxed ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}