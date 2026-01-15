import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#141414] text-white pt-10 pb-5 px-6 md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">

        {/* About */}
        <div className='h-full '>
          <h2 className="text-lg font-semibold mb-0">About</h2>
          <div className='h-full flex flex-col gap-4'>
          <p className="text-sm text-gray-300">
            AniHive is your one-stop platform to browse airing anime, discover top-rated series, and explore the latest anime trends.
          </p>
          <p className="text-sm text-gray-500">
            Disclaimer: This site does not store any files on its server. All contents are provided by non-affiliated third parties.
          </p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><button onClick={()=>navigate('/')} className="hover:text-white cursor-pointer">Anime</button></li>
            <li><button onClick={()=>navigate('/schedule')} className="hover:text-white cursor-pointer">Schedule</button></li>
            <li><button onClick={()=>navigate('/explore')} className="hover:text-white cursor-pointer">Explore</button></li>
            <li><button onClick={()=>navigate('/characters')} className="hover:text-white cursor-pointer">Characters</button></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Contact</h2>
          <p className="text-sm text-gray-300">Email: contact@anihive.com</p>
          <p className="text-sm text-gray-300">Phone: +63 912 345 6789</p>
          <p className="text-sm text-gray-300">Location: Batangas, Philippines</p>
        </div>

        {/* Socials */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Follow Us</h2>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white">
              <FaInstagram />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 border-t border-gray-800 pt-4">
        © {new Date().getFullYear()} AniHive. All rights reserved.
      </div>
    </footer>
  );
}
